<?php

namespace App\Http\Controllers;

use App\Models\Request as ShipmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Srmklive\PayPal\Services\PayPal as PayPalClient;

class PayPalController extends Controller
{
    /**
     * Process transaction.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function processTransaction(Request $request)
    {
        Log::info('Processing transaction for request ID: ' . $request->input('request_id'));

        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        Log::info('PayPal token retrieved: ' . json_encode($paypalToken));

        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('api.successTransaction'),
                "cancel_url" => route('api.cancelTransaction'),
            ],
            "purchase_units" => [
                0 => [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $request->input('amount'),
                    ],
                ],
            ],
        ]);
        

        if (isset($response['id']) && $response['id'] != null) {
            Log::info('PayPal order created successfully: ' . $response['id']);
            Log::info($response);

            // Find approve link to redirect
            foreach ($response['links'] as $links) {
                if ($links['rel'] == 'approve') {
                    Log::info('Approval link found: ' . $links['href']);

                    // Save the payment URL to the request record
                    $shipmentRequest = ShipmentRequest::find($request->input('request_id'));
                    $shipmentRequest->update([
                        'payment_url' => $links['href'],
                    ]);
                    Log::info('Payment URL updated in request record: ' . $links['href']);

                    return response()->json(['url' => $links['href']]);
                }
            }

            Log::error('Approval link not found in PayPal response');
            return response()->json(['error' => 'Something went wrong.'], 500);
        } else {
            Log::error('PayPal order creation failed: ' . ($response['message'] ?? 'Unknown error'));
            return response()->json(['error' => $response['message'] ?? 'Something went wrong.'], 500);
        }
    }

    /**
     * Success transaction.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function successTransaction(Request $request)
    {
        Log::info('Success transaction callback received');

        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        Log::info('PayPal token retrieved for capturing payment');

        $response = $provider->capturePaymentOrder($request['token']);
        Log::info('PayPal capture payment response: ' . json_encode($response));

        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            Log::info('request');
            Log::info(json_encode($request));
            Log::info('response');
            Log::info(json_encode($response));
            Log::info('Payment completed successfully for token: ' . $request['token']);
            Log::info('Payment completed successfully for Request: ' . $request->input('payment_url'));

            $payment_url = "https://www.sandbox.paypal.com/checkoutnow?token=" . $response["id"];

            // Update the request with payment details
            $shipmentRequest = ShipmentRequest::where('payment_url', $payment_url)->first();
            Log::info('Shipment Request');
            Log::info(json_encode($shipmentRequest));
            $shipmentRequest->update([
                'payment_status' => 'Paid',
                'payment_method' => 'PayPal',
            ]);
            Log::info('Payment details updated in request record');

            return response()->json(['success' => 'Transaction complete.']);
        } else {
            Log::error('Payment capture failed: ' . ($response['message'] ?? 'Unknown error'));
            return response()->json(['error' => $response['message'] ?? 'Something went wrong.'], 500);
        }
    }

    /**
     * Cancel transaction.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancelTransaction(Request $request)
    {
        Log::info('Transaction canceled by user');
        return response()->json(['error' => 'You have canceled the transaction.']);
    }
}
