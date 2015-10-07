#include <stdio.h>
#include <gsl/gsl_sf_bessel.h>
#include <nan.h>

void prueba (const Nan::FunctionCallbackInfo<v8::Value>& info) 
{
  double x = 5.0;
  double y = gsl_sf_bessel_J0 (x);
  printf ("J0(%g) = %.18e\n", x, y);
}

void CreateFunction(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(prueba);
  v8::Local<v8::Function> fn = tpl->GetFunction();

  // omit this to make it anonymous
  fn->SetName(Nan::New("theFunction").ToLocalChecked());

  info.GetReturnValue().Set(fn);
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  Nan::SetMethod(module, "exports", CreateFunction);
}

NODE_MODULE(addon, Init)
