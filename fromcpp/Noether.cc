#include <nan.h>
#include <stdio.h>
#include <gsl/gsl_rng.h>

void Random(const Nan::FunctionCallbackInfo<v8::Value>& info) {
	const gsl_rng_type * T;
  gsl_rng * r;
  gsl_rng_env_setup();
  T = gsl_rng_default;
  r = gsl_rng_alloc (T);
	double random = gsl_rng_uniform (r);
	gsl_rng_free (r);
  info.GetReturnValue().Set(Nan::New(random));
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
	v8::Local<v8::Object> obj = Nan::New<v8::Object>();
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(Random);
	  v8::Local<v8::Function> fn = tpl->GetFunction();
	obj->Set(Nan::New("random").ToLocalChecked(),fn);
		module->Set(Nan::New("exports").ToLocalChecked(),obj);
}

NODE_MODULE(Noether, Init)
