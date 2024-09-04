<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;

class PaymentController extends Controller
{
    protected $base;

    public function __construct()
    {
        $this->base = "https://api-m.sandbox.paypal.com";
    }

    private function generateAccessToken()
    {
        $clientId = env('PAYPAL_CLIENT_ID');
        $clientSecret = env('PAYPAL_CLIENT_SECRET');

        if (!$clientId || !$clientSecret) {
            throw new \Exception("MISSING_API_CREDENTIALS");
        }

        $auth = base64_encode("$clientId:$clientSecret");
        $client = new Client();
        $response = $client->post("$this->base/v1/oauth2/token", [
            "form_params" => [
                "grant_type" => "client_credentials",
            ],
            "headers" => [
                "Authorization" => "Basic $auth",
            ],
        ]);

        $data = json_decode($response->getBody(), true);
        return $data["access_token"];
    }

    private function handleResponse($response)
    {
        $jsonResponse = json_decode($response->getBody(), true);
        return [
            "jsonResponse" => $jsonResponse,
            "httpStatusCode" => $response->getStatusCode(),
        ];
    }

    public function createOrder(Request $request)
    {
        $accessToken = $this->generateAccessToken();
        $client = new Client();

        $payload = [
            "intent" => "CAPTURE",
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => "100",
                    ],
                ],
            ],
            "payment_source" => [
                "card" => [
                    "attribute" => [
                        "verification" => [
                            "method" => "SCA_ALWAYS",
                        ],
                    ],
                ],
            ],
        ];

        $response = $client->post("$this->base/v2/checkout/orders", [
            "headers" => [
                "Content-Type" => "application/json",
                "Authorization" => "Bearer $accessToken",
            ],
            "json" => $payload,
        ]);

        return response()->json($this->handleResponse($response), $response->getStatusCode());
    }

    public function captureOrder($orderId)
    {
        $accessToken = $this->generateAccessToken();
        $client = new Client();

        $response = $client->post("$this->base/v2/checkout/orders/$orderId/capture", [
            "headers" => [
                "Content-Type" => "application/json",
                "Authorization" => "Bearer $accessToken",
            ],
        ]);

        return response()->json($this->handleResponse($response), $response->getStatusCode());
    }

    public function authorizeOrder($orderId)
    {
        $accessToken = $this->generateAccessToken();
        $client = new Client();

        $response = $client->post("$this->base/v2/checkout/orders/$orderId/authorize", [
            "headers" => [
                "Content-Type" => "application/json",
                "Authorization" => "Bearer $accessToken",
            ],
        ]);

        return response()->json($this->handleResponse($response), $response->getStatusCode());
    }

    public function captureAuthorize($authorizationId)
    {
        $accessToken = $this->generateAccessToken();
        $client = new Client();

        $response = $client->post(
            "$this->base/v2/payments/authorizations/$authorizationId/capture",
            [
                "headers" => [
                    "Content-Type" => "application/json",
                    "Authorization" => "Bearer $accessToken",
                ],
            ]
        );

        return response()->json($this->handleResponse($response), $response->getStatusCode());
    }
}
