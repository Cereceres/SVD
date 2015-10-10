#include <stdio.h>
#include <gsl/gsl_matrix.h>
#include <gsl/gsl_linalg.h>
#include <gsl/gsl_blas.h>
#include <nan.h>
#include <math.h>
#include <gsl/gsl_sf_bessel.h>
using namespace v8;

template <class T>
int Dot(T* a,T* b, double& result) {
  size_t l = a->size;
  size_t k = b->size;
  l = l >= k ? k : l ;
  size_t i ; double sum=0;
   for ( i = 0; i < l; i++) {
      sum +=
      gsl_vector_get (a, i)*
      gsl_vector_get (b, i);
   }
   result = sum ;
   return 0;

}

template <class T>
void map_vec(T* a,double (*calling)(double,int) ) {
  int l = (size_t ) a->size;
  int i ;
   for ( i = 0; i < l; i++) {
    gsl_vector_set(a, i,(*calling)(gsl_vector_get (a, i),i));
   }
}

 double sqrtf(double item, int index){
    return sqrt(item);
 }
template <class T>
 void couting_vec(const T* a,  const double &limit , const double &sumt, int * count){
   int *i =  count ; *i=0;
   double _lim =gsl_vector_get(a, *i)/sumt;
   printf("limit %f \n",_lim );
   while(_lim <= limit) {
     (*i)++;
     _lim +=gsl_vector_get(a, *i)/sumt;
     printf("limit %f \n",_lim );
   }
 }

void prueba (const Nan::FunctionCallbackInfo<v8::Value>& info) {
  double x =0; int i,j,l,m,n;
  double _limit = info[1]->NumberValue();
  printf("limit = %f\n",_limit );
  Handle<Array> array, *_array;
  if (info[0]->IsArray()) {
     array = Handle<Array>::Cast(info[0]);
    m = (int) array->Length();
    _array = new Handle<Array>[m];

      _array[0]=Handle<Array>::Cast(array->Get(0));
    n= (int) _array[0]->Length();
    gsl_matrix *M = gsl_matrix_calloc(m, n) ;
    for (i = 0; i < m; i++) {
      _array[i] = Handle<Array>::Cast(array->Get(i));
      l = (int) _array[i]->Length();

      for ( j = 0; j < l; j++) {
       x = _array[i]->Get(j)->NumberValue();
        gsl_matrix_set(M, (size_t) i, (size_t) j, x);
      }
    }
    int column = (int) M->size2, N; double result=0,media = 0, sigma = 0,_sigma=1;
    gsl_vector_view   Column ;
    gsl_vector* Ident=gsl_vector_calloc(m);
    gsl_vector* _Ident=gsl_vector_calloc(m);
    gsl_vector_set_all(_Ident, 1);
    for ( i = 0; i < column; i++) {
      Column = gsl_matrix_column (M, (size_t) i);
      N= (int) Column.vector.size;
      Dot<gsl_vector>(&Column.vector,_Ident,result);
      int N= (int) Column.vector.size;
      media =result / N;
      Dot<gsl_vector>(&Column.vector,&Column.vector,result);
      sigma = sqrtf((double)( (result)/(N-1)-media*media));
      _sigma = 1/sigma;
      gsl_vector_set_all (Ident, 1);
      gsl_vector_scale(Ident,media);
      gsl_vector_sub(&Column.vector, Ident) ;
      gsl_vector_scale(&Column.vector, _sigma) ;
      result = 0; media  =0;
    }
    gsl_matrix *V = gsl_matrix_calloc( n,  n) ;
    gsl_matrix *X = gsl_matrix_calloc(n, n) ;
    gsl_vector *work = gsl_vector_calloc((size_t) n),
    *S = gsl_vector_calloc((size_t) n);
     gsl_linalg_SV_decomp_mod (M, X, V,S, work);
     double (*tocall)(double,int) = sqrtf ;
     map_vec(S, tocall);
      printf("el vector S es\n" );
    gsl_vector_fprintf(stdout,S, "%f");
    Dot<gsl_vector>(S,_Ident,result);
    double Sum = result; int* count= new int;
    printf("suma = %f\n",Sum );
    couting_vec(S,_limit,Sum, count);
    printf("count = %d\n", *count);
    int c =*count+1;
    printf("c= %d\n", c);
    gsl_vector* _S_ = gsl_vector_calloc((size_t) c);
    gsl_vector_view   _S =
    gsl_vector_subvector(S, 0, (size_t) c);
    gsl_vector_memcpy (_S_, &_S.vector);
    printf("el vector _S_ es\n" );
    gsl_vector_fprintf(stdout,_S_, "%f");
    gsl_matrix_view _V = gsl_matrix_submatrix (V,0,0,V->size1 , (size_t)c);
    gsl_matrix * _V_ = gsl_matrix_calloc(V->size1 , (size_t)c);
    gsl_matrix_memcpy(_V_, &_V.matrix);
    for (i = 0; i < column; i++) {
      printf("|");
      for (j = 0; j < c; j++) {
          printf(" %f ", gsl_matrix_get (_V_, i,j));
      }
        printf("|\n");
    }
  }

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
