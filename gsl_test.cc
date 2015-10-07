#include <stdio.h>
#include <gsl/gsl_sf_bessel.h>
#include <nan.h>
using namespace v8;

void prueba (const Nan::FunctionCallbackInfo<v8::Value>& info) {
  double x ; int i; Handle<Array> array;
  if (info[0]->IsArray()) {
     array = Handle<Array>::Cast(info[0]);
    int l = (int) array->Length();
    for (i = 0; i < l; i++) {
     x = array->Get(i)->NumberValue();
     printf("x=%f\n",x );
    }
  }
   x = array->Get(0)->NumberValue();
  double y = gsl_sf_bessel_J0 (x);
  printf ("J0(%g) = %.18e\n", x, y);
}

void CreateFunction(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(prueba);
  v8::Local<v8::Function> fn = tpl->GetFunction();

  info.GetReturnValue().Set(fn);
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  Nan::SetMethod(module, "exports", CreateFunction);
}

NODE_MODULE(addon, Init)
