#include <nan.h>
#include <stdlib.h>
#include <cmath>

double _rand(){
	std::srand( std::time(nullptr)); // use current time as seed for random generator
  return (std::rand()%11111111111)/11111111111;
}


double generateGaussianNoise(double mu, double sigma)
{

	const double two_pi = 2.0*3.14159265358979323846;
	static double z0;
	double u1 = _rand(), u2 = _rand();
	printf("u1 =%f u2 = %f \n",u1,u2 );
	z0 = sqrt(-2.0 * log(u1)) * cos(two_pi * u2);
	return z0 * sigma + mu;
}

void Random(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  double mu = info[0]->NumberValue(),
  sigma = info[1]->NumberValue();
    double random = generateGaussianNoise( mu, sigma);
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
