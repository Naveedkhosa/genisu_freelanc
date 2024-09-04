<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\GeneralSetting;
use App\Models\Shipment;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PaymentController extends Controller
{

    public function createOrder(Request $request)
    {
        $bid_id = $request->get('bid_id');
        $bid = Bid::find($bid_id);
        if (!$bid) {
            return response()->json(['error' => true, "message" => "No Bid was found"], 200);
        }
        $total_shipping_amount = floor($bid->bid_amount);

        $per_transaction_fee_obj = GeneralSetting::select("setting_value")->where('setting_key', '=', 'per_transaction_fee')->first();
        $per_transaction_fee_percentage = $per_transaction_fee_obj->setting_value;
        $gst_tax_obj = GeneralSetting::select("setting_value")->where('setting_key', '=', 'gst_tax')->first();
        $gst_tax_percentage = $gst_tax_obj->setting_value;

        $total_tax = floor(($total_shipping_amount / 100) * $gst_tax_percentage);
        $total_transaction_fee = floor(($total_shipping_amount / 100) * $per_transaction_fee_percentage);
        $sub_total = $total_transaction_fee + $total_shipping_amount + $total_tax;

        $data = [
            "shipping_amount" => $total_shipping_amount,
            "transaction_fee" => $total_transaction_fee,
            "tax" => $total_tax,
            "sub_total" => $sub_total,
        ];

        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();

        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => $request->input("return_url"),
                "cancel_url" => $request->input("cancel_url"),
            ],
            "purchase_units" => [
                0 => [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $data['sub_total'],
                    ],
                ],
            ],
        ]);

        if (isset($response['id']) && $response['id'] != null) {
            // create transaction
            $transaction = Transaction::create(
                [
                    'payment_id' => $response['id'],
                    'bid_id' => $bid->id,
                    'payer_name' => '',
                    'payer_email' => '',
                    'amount' => $data['sub_total'],
                    'currency' => 'USD',
                    'payment_status' => 'processing',
                    'payment_method' => 'PaYpal',
                ]
            );

            if ($transaction->id) {
                foreach ($response['links'] as $links) {
                    if ($links['rel'] == 'approve') {
                        return response()->json(['url' => $links['href']]);
                    }
                }
            }else{
                return response()->json(['error' => 'Failed To Create Transaction'], 500);
            }
        } else {
            return response()->json(['error' => $response['message'] ?? 'Order can not be proccessed'], 500);
        }

    }

    public function checkoutprocess(Request $request)
    {
        $bid_id = $request->get('bid_id');
        $bid = Bid::find($bid_id);
        $total_shipping_amount = floor($bid->bid_amount);
        $per_transaction_fee_obj = GeneralSetting::select("setting_value")->where('setting_key', '=', 'per_transaction_fee')->first();
        $per_transaction_fee_percentage = $per_transaction_fee_obj->setting_value;
        $gst_tax_obj = GeneralSetting::select("setting_value")->where('setting_key', '=', 'gst_tax')->first();
        $gst_tax_percentage = $gst_tax_obj->setting_value;

        $total_tax = floor(($total_shipping_amount / 100) * $gst_tax_percentage);
        $total_transaction_fee = floor(($total_shipping_amount / 100) * $per_transaction_fee_percentage);

        $sub_total = $total_transaction_fee + $total_shipping_amount + $total_tax;

        $data = [
            "shipping_amount" => $total_shipping_amount,
            "transaction_fee" => $total_transaction_fee,
            "tax" => $total_tax,
            "sub_total" => $sub_total,
        ];
        return response()->json($data, 200);
    }

    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($request['token']);
        if (isset($response['status']) && $response['status'] == 'COMPLETED') {

            // update transaction status

            $transaction = Transaction::where('payment_id', '=', $request['token'])->first();
            $bid = Bid::find($transaction->bid_id);
            $shipment_id = $bid->shipment_id;

            DB::beginTransaction();

            try {

                $transaction->update([
                    'payment_status' => 'completed',
                    'payer_name' => $response['payer']['name']['given_name'],
                    'payer_email' => $response['payer']['email_address']
                ]);

                // update bid status
                $bid->update([
                    'bid_status' => 'accepted',
                ]);

                // update shipment status
                $shipment = Shipment::find($shipment_id);
                $shipment->update([
                    'status' => 'order_confirmed',
                ]);

                DB::commit();

                // add any other necessary actions here like sending email, updating stock, etc.

                // send email to bidder and admin
                // $this->sendEmailNotification($transaction, $bid, $shipment);

                $data = [
                    "transaction" => $transaction,
                    "bid" => $bid,
                    "shipment_id" => $shipment_id,
                    "response"=>$response
                ];
                
                return response()->json(['success' => true, "message" => "Transaction completed successfully"]);

            } catch (\Throwable $th) {
                DB::rollBack();
                return response()->json(['error' => true, "message" => "An error occurred while updating the transaction status. Please contact to support team."], 500);
            }

        } else {
            $error_msg = 'Unknown error occurred.';
            if (isset($response['error']['details'][0]['description'])) {
                $error_msg = $response['error']['details'][0]['description'];
            }
            return response()->json(['error' => true, "message" => $error_msg], 200);
        }
    }

}
