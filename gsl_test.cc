#include <stdio.h>
#include <gsl/gsl_matrix.h>
#include <gsl/gsl_linalg.h>
#include <gsl/gsl_blas.h>
#include <nan.h>
#include <math.h>
#include <gsl/gsl_randist.h>
using namespace v8;

int Dot(const gsl_vector * a, const gsl_vector * b, double& result) {
  double *sum= new double;
   gsl_blas_ddot(a,b,sum);
   result = *sum;
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

 double normal_pdf(const gsl_vector * arg,const gsl_vector * sigma){
   double p_x=1;
   int i; int length = (int) arg->size;
   for ( i = 0; i < length; i++) {
     p_x *= gsl_ran_gaussian_pdf(arg->data[i],sigma->data[i]);
   }
   return p_x;
 }

template <class T>
 void couting_vec(const T* a,  const double &limit , const double &sumt, int * count){
   int l = (int) a->size ;
   int *i =  count ; *i=0;
   double _lim =gsl_vector_get(a, *i)/sumt;
   *i=1;
   while( _lim <= limit && *i<l ){
     _lim +=gsl_vector_get(a, *i)/sumt;
    (*i)++;
   }

 }
  gsl_matrix * read_matrix(const Nan::FunctionCallbackInfo<v8::Value>& info){
    double x =0; int i,j,l,m,n;
      Handle<Array> array, *_array;
   // If the arg is a array, we build the gsl_matrix object
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
     return M;
   }
   gsl_matrix *M = gsl_matrix_calloc(1, 1);
   return M;
 }


//
void gsl_pca (const Nan::FunctionCallbackInfo<v8::Value>& info) {
    int i,j,m,n;
    double _limit = info[1]->NumberValue();
     gsl_matrix *M = read_matrix(info);
     m= (int) M->size1; n = (int) M->size2;
    int column = (int) M->size2; double result=0,media = 0, sigma = 0,_sigma=1;
    gsl_vector_view   Column ;
    gsl_vector *Ident=gsl_vector_calloc(m),
    * _Ident=gsl_vector_calloc(m),
    * Media=gsl_vector_calloc(n),
    * Sigma=gsl_vector_calloc(n) ;

    // We read the variables from the matrix data.
    gsl_vector_set_all(_Ident, 1);
    for ( i = 0; i < column; i++) {
      Column = gsl_matrix_column (M, (size_t) i);

      Dot(&Column.vector,_Ident,result);
      int N= (int) Column.vector.size;
      media =result / N;

      Dot(&Column.vector,&Column.vector,result);
      sigma = sqrtf((double)( (result)/(N-1)-media*media));
      _sigma = 1/sigma;
      gsl_vector_set(Media, (size_t) i, media);
      gsl_vector_set(Sigma, (size_t) i, _sigma);
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
    gsl_vector * ident = gsl_vector_calloc((size_t)n);
    gsl_vector_set_all(ident,1);
    Dot(S,ident,result);
    double Sum = result; int* count= new int;
    couting_vec(S,_limit,Sum, count);
    int c =*count;
    gsl_vector* _S_ = gsl_vector_calloc((size_t) c);
    gsl_vector_view   _S =
    gsl_vector_subvector(S, 0, (size_t) c);
    gsl_vector_memcpy (_S_, &_S.vector);
    gsl_matrix_view _V = gsl_matrix_submatrix (V,0,0,V->size1 , (size_t)c);
    gsl_matrix * _V_ = gsl_matrix_calloc(V->size1 , (size_t)c);
    gsl_matrix_memcpy(_V_, &_V.matrix);
    printf("la matrix V es\n" );
    for (i = 0; i < column; i++) {
      printf("|");
      for (j = 0; j < c; j++) {
          printf(" %f ", gsl_matrix_get (_V_, i,j));
      }
        printf("|\n");
    }
    Handle<Array> H_Arg=Handle<Array>::Cast(info[2]);
    gsl_vector * Arg = gsl_vector_calloc(n),
    *Arg_red = gsl_vector_calloc(c);
    for ( i = 0; i < n; i++) {
      gsl_vector_set(Arg,i,H_Arg->Get(i)->NumberValue());
    }
    gsl_vector_sub(Arg,Media);
    gsl_vector_mul(Arg,Sigma);
    gsl_matrix_view _Arg=
    gsl_matrix_view_array(Arg->data, n,1);
    gsl_matrix_view _Arg_red = gsl_matrix_view_array(Arg_red->data, c, 1);
    gsl_matrix *V_T= gsl_matrix_calloc(c,n);
    gsl_matrix_transpose_memcpy(V_T,_V_);
    gsl_blas_dgemm(CblasNoTrans, CblasNoTrans,
                  1.0,V_T,&_Arg.matrix,0.0,&_Arg_red.matrix);
    double x=normal_pdf(Arg_red,_S_);

    v8::Local<v8::Object> obj = Nan::New<v8::Object>();
    v8::Local<v8::Number> num = Nan::New(x);
    Handle<Array> R_array = Nan::New<v8::Array>(c);
    for (i = 0; i < c; i++) {
      R_array->Set(i, Nan::New(_S_->data[i]));
    }
      Handle<Array> V_array = Nan::New<v8::Array>(c);
      Handle<Array> V2_array = Nan::New<v8::Array>(n);
    for (i = 0; i < c; i++) {
      for ( j = 0; j < n; j++) {
          V2_array->Set(j, Nan::New(gsl_matrix_get(_V_,j,i)));
      }
      V_array->Set(i,V2_array );
    }
    obj->Set(Nan::New("p_x").ToLocalChecked(),num);
    obj->Set(Nan::New("S_corr").ToLocalChecked(),R_array);
    obj->Set(Nan::New("V_trans").ToLocalChecked(),V_array);
    info.GetReturnValue().Set(obj);
  }

void CreateFunction(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(gsl_pca);
  v8::Local<v8::Function> fn = tpl->GetFunction();

  info.GetReturnValue().Set(fn);
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  Nan::SetMethod(module, "exports", CreateFunction);
}

NODE_MODULE(addon, Init)
