<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use App\Models\User;

use Illuminate\Http\Request;


  class Auth extends Controller
{
    //
    public static function register(Request $request) {

        $validator = Validator::make($request->all(), [
            'email' => 'required|unique:users',
            'password' => 'required|min:6'
        ]);
     if ($validator->fails()) {
        return response()->json([
            "status" => false,
            "message" => $validator->errors()
        ]);
     
     } else {
         $check = User::create([
            'full_name' => $request->input('full-name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'status' => 0,
        ]);

        FacadesAuth::login($check);

        return response()->json([
            "status" => true,
            "message" => "successfully registered"
        ]);
     }
     
    }

    public static function login(Request $request) {
           $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors(),
            ]);
        } else {
            if (FacadesAuth::attempt($request->only(['email', 'password']))) {
                # code...
                return response()->json([
                    'status' => true,
                    'message' => 'login is successful',
                    'redirect' => url('/')
                ]);
            } else {
                return response()->json([
                    'status' => false,
                    'message' => ['invalid credentials']
                ]);
            }
        }
    }

    public static function account_type (Request $request) {
       $dataQ = DB::table('users')->where('id', FacadesAuth::id())->update([
            'type' => $request->input('accountType')
        ]);
        if ($dataQ) {
            return response()->json([
                "status" => true,
                "message" => "record updated"
            ]);
        } else {
             return response()->json([
                "status" => false,
                "message" => "error updating record"
            ]); 
        }
    }

    function logout()
    {
        Session::flush();
        FacadesAuth::logout();

        return Redirect('/login');
    }
}
