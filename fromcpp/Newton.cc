#include <stdio.h>
#include <gsl/gsl_matrix.h>
#include <gsl/gsl_linalg.h>
#include <gsl/gsl_blas.h>
#include <nan.h>
#include <math.h>
#include <gsl/gsl_randist.h>
using namespace v8;
// The Dot function that calculate the dot producto between two vectors
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

double  sqrtf(double item, int index){
    return sqrt(item);
 }
// The normal function
 double normal_pdf(const gsl_vector * arg,const gsl_vector * sigma){
   double p_x=1;
   int i; int length = (int) arg->size;
   for ( i = 0; i < length; i++) {
     p_x *= gsl_ran_gaussian_pdf(arg->data[i],sigma->data[i]);
   }
   return p_x;
 }
//the couting function
 void couting_vec(const gsl_vector* a,  const double &limit , const double &sumt, int * count){
   int l = (int) a->size ;
   int *i =  count ; *i=0;
   double _lim =gsl_vector_get(a, *i)/sumt;
   *i=1;
   while( _lim <= limit && *i<l ){
     _lim +=gsl_vector_get(a, *i)/sumt;
    (*i)++;
   }

 }
 // the function that read the data from info
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


 void _sqrtf(const Nan::FunctionCallbackInfo<v8::Value>& info){
   double x = sqrt( info[0]->NumberValue());
   info.GetReturnValue().Set(Nan::New(x));
}
//The function that shift the datas to media value and normalize to sigma
 void normalization(gsl_matrix * M, gsl_vector * Media, gsl_vector * Sigma){
   int column = (int) M->size2,
   m= (int) M->size1,i;
   gsl_vector_view   Column ;
   double media = 0, sigma = 0,_sigma=1, result = 0;
   gsl_vector *_Ident=gsl_vector_alloc(m);
   gsl_vector *Ident=gsl_vector_alloc(m);
   gsl_vector_set_all(_Ident, 1);
   gsl_vector_set_all (Ident, 1);
   for ( i = 0; i < column; i++) {
     // We read the column i from M
     Column = gsl_matrix_column (M, (size_t) i);
     // Calculate  Sum_i^n x_i
     Dot(&Column.vector,_Ident,result);
     // The number of data is read from column vector'size.
     int N= (int) Column.vector.size;
     printf("N=%d\n",N );
     // The media is calculated
     media =result / N;
     printf("media=%f\n",media );
     // Sum_i^n x_i^2 is calculated.
     Dot(&Column.vector,&Column.vector,result);
     // from sigma^2 =// <x^2>-<x^2>  is calculated.
     sigma = sqrtf((double)( (result)/(N-1)-media*media));
     printf("sigma=%f\n",sigma );
     // The sigma^-1 is calculated
     if (sigma!=0) {
       _sigma = 1/sigma;
     } else{
        _sigma = 0;
     }
     //The values of media is stored into Media vector
     gsl_vector_set(Media, (size_t) i, media);
     //The values of sigma^-1 is stored into Sigma vector
     gsl_vector_set(Sigma, (size_t) i, _sigma);

     gsl_vector_scale(Ident,media);
     // the measures are translated where the media es zero
     gsl_vector_sub(&Column.vector, Ident) ;
     // the measures are scaled to sigma.
     gsl_vector_scale(&Column.vector, _sigma) ;
     result = 0; media  =0;
   }
   gsl_vector_free (Ident);gsl_vector_free (_Ident);
 }

 void vnorm( gsl_vector* S, double * sum) {
   int n =(int)  S->size;
   gsl_vector * ident = gsl_vector_calloc((size_t)n);
   gsl_vector_set_all(ident,1);
   Dot(S,ident,*sum);
 }

 void dim_red( gsl_matrix *V ,gsl_matrix* _V_ ,gsl_vector* S, gsl_vector* _S_,int *count) {
   //With the limit given the dimension is reduced
   gsl_vector_view   _S =
   gsl_vector_subvector(S, 0, (size_t) *count);
   gsl_vector_memcpy (_S_, &_S.vector);
   //The dimension is reduced
   gsl_matrix_view _V = gsl_matrix_submatrix (V,0,0,V->size1, (size_t) *count);
   gsl_matrix_memcpy(_V_, &_V.matrix);
 }

// the pca
void gsl_pca (const Nan::FunctionCallbackInfo<v8::Value>& info) {
    int i,j,n;
    // the array is read from info and stored into matrix M
     gsl_matrix *M = read_matrix(info);
     // the size of matrix is read
      n = (int) M->size2;
    // Define the vectors Media and Sigma, The last will store
    // the madia and and sigma values to every variable.
    gsl_vector * Media=gsl_vector_calloc(n),
    * Sigma=gsl_vector_calloc(n) ;
    // We read the variables from the matrix data, and we make
    //the media = 0 normalize the measures to sigma.
    normalization(M,Media,Sigma);
    gsl_matrix *V = gsl_matrix_calloc( n,  n) ;
    //  gsl_matrix *X = gsl_matrix_calloc(n, n) ;
    //  gsl_vector *work = gsl_vector_calloc((size_t) n);
    gsl_vector *S = gsl_vector_calloc((size_t) n);
    // The SVD is done
    gsl_linalg_SV_decomp_jacobi(M,V,S);
    // gsl_linalg_SV_decomp_mod(M, X, V,S, work);
    double * Sum = new double;
    vnorm(S,Sum);
    int* count= new int;
    // The limite for counting variables is read.
    double _limit = info[1]->NumberValue();
    couting_vec(S,_limit,*Sum, count);
     gsl_vector* _S_ = gsl_vector_calloc((size_t) *count);
     gsl_matrix* _V_= gsl_matrix_calloc(V->size1 ,(size_t) *count);
     dim_red( V ,_V_ ,S,_S_,count);
      //with the arguments passed the probability of succed is calculated
      Handle<Array> H_Arg=Handle<Array>::Cast(info[2]);
        printf("e\n");
      gsl_vector * Arg = gsl_vector_calloc(n),
      *Arg_red = gsl_vector_calloc((size_t) *count);
      printf("f\n");
      // The vector Arg is build grom info given
      for ( i = 0; i < n; i++) {
        printf("f==== %f\n",H_Arg->Get(i)->NumberValue());
        gsl_vector_set(Arg,i,H_Arg->Get(i)->NumberValue());
      }
      printf("2\n");
      // the media is substracted
      gsl_vector_sub(Arg,Media);
      // is scaled to sigma
      printf("3\n");
      gsl_vector_mul(Arg,Sigma);
      // A matrix is build from vector Arg
      gsl_matrix_view _Arg=
      gsl_matrix_view_array(Arg->data, n,1);
      printf("4\n");
      // The vector of arg is build, where the dimension is <= that orginal
      // dimension
      gsl_matrix_view _Arg_red = gsl_matrix_view_array(Arg_red->data, (size_t) *count, 1);
      gsl_matrix *V_T= gsl_matrix_calloc((size_t) *count,n);
      gsl_matrix_transpose_memcpy(V_T,_V_);
      // The Arg reduced is calculated from X_red = A^T X
      // where the matrix A is given for the condition of dimension reducing
      printf("5\n");
      gsl_blas_dgemm(CblasNoTrans, CblasNoTrans,
                    1.0,V_T,&_Arg.matrix,0.0,&_Arg_red.matrix);
                    printf("6\n");
      double x=normal_pdf(Arg_red,_S_);
      v8::Local<v8::Number> num = Nan::New(x);
    // The object to return are build
    v8::Local<v8::Object> obj = Nan::New<v8::Object>();
    Handle<Array> R_array = Nan::New<v8::Array>((size_t) *count);
    for (i = 0; i <  *count; i++) {
      R_array->Set(i, Nan::New(_S_->data[i]));
    }
      Handle<Array> V_array = Nan::New<v8::Array>((size_t) *count);
      Handle<Array> V2_array = Nan::New<v8::Array>(n);
    for (i = 0; i < *count; i++) {
      for ( j = 0; j < n; j++) {
          V2_array->Set(j, Nan::New(gsl_matrix_get(_V_,j,i)));
      }
      V_array->Set(i,V2_array );
    }
    printf("7\n");
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(_sqrtf);
    v8::Local<v8::Function> fn = tpl->GetFunction();
    printf("8\n");
    // The object to return is done
    obj->Set(Nan::New("p_x").ToLocalChecked(),num);
    obj->Set(Nan::New("S_corr").ToLocalChecked(),R_array);
    obj->Set(Nan::New("V_trans").ToLocalChecked(),V_array);
    obj->Set(Nan::New("sqrt").ToLocalChecked(),fn);
    // The return object
    info.GetReturnValue().Set(obj);
    // deallocate the space used by the matrix
    gsl_matrix_free (M);gsl_matrix_free (V_T);gsl_matrix_free (_V_);/*gsl_vector_free (work);+*/
    gsl_vector_free (Sigma);gsl_vector_free (Media);
    gsl_vector_free (S);gsl_vector_free (_S_);
    gsl_vector_free (Arg);gsl_vector_free (Arg_red);
  }

void CreateFunction(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(gsl_pca);
  v8::Local<v8::Function> fn = tpl->GetFunction();

  info.GetReturnValue().Set(fn);
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  Nan::SetMethod(module, "exports", CreateFunction);
}

NODE_MODULE(newton, Init)
