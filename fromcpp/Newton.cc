#include <stdio.h>
#include <gsl/gsl_matrix.h>
#include <gsl/gsl_linalg.h>
#include <gsl/gsl_blas.h>
#include <nan.h>
#include <math.h>
#include <gsl/gsl_randist.h>
#include <gsl/gsl_cdf.h>
#include <gsl/gsl_randist.h>
using namespace std;
using namespace v8;
// The Dot function that calculate the dot producto between two vectors
int Dot(const gsl_vector * a, const gsl_vector * b, double& result) {
  v8::Isolate* isolate = v8::Isolate::GetCurrent();
    v8::TryCatch::TryCatch trycatch(isolate );
    double *sum= new double;
    gsl_blas_ddot(a,b,sum);
    result = *sum;
    v8::Local<Value> exception = trycatch.Exception();
    if (!exception.IsEmpty()) {
      v8::String::Utf8Value exception_str(exception);
      printf("Exception: %s\n", *exception_str);
    }
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
// The normal function calculate
 double normal_pdf(const gsl_vector * arg,const gsl_vector * sigma){
   v8::TryCatch::TryCatch trycatch;
    double twopisqrt = sqrt(2*M_PI),p_x=1/twopisqrt, mu;
    int i; int length = (int) arg->size;
    for ( i = 0; i < length; i++) {
      mu = arg->data[i]/sigma->data[i];
      mu= mu*mu;
      p_x =p_x*exp(-mu);
    }
    v8::Local<Value> exception = trycatch.Exception();
    if (!exception.IsEmpty()) {
      v8::String::Utf8Value exception_str(exception);
      printf("Exception: %s\n", *exception_str);
    }
   return p_x;
 }

 // The normal comulative function calculate
  double normal_cdf_Q(const gsl_vector * arg,const gsl_vector * sigma){
    v8::TryCatch::TryCatch trycatch;
    double twopisqrt = sqrt(2*M_PI),p_x=1/twopisqrt, mu=0;
    int i; int length = (int) arg->size;
    for ( i = 0; i < length; i++) {
      mu = mu+(arg->data[i]/sigma->data[i])*
      (arg->data[i]/sigma->data[i]);
    }
    p_x = gsl_cdf_gaussian_Q(mu,1);
    v8::Local<Value> exception = trycatch.Exception();
    if (!exception.IsEmpty()) {
      v8::String::Utf8Value exception_str(exception);
      printf("Exception: %s\n", *exception_str);
    }
    return p_x;
  }
//the couting function that eliminate de varianze without importance
 void couting_vec(const gsl_vector* a,  const double &limit , const double &sumt, int * count){
   v8::TryCatch::TryCatch trycatch;
    int l = (int) a->size ;
    int *i =  count ; *i=0;
    double _lim =gsl_vector_get(a, *i)/sumt;
    *i=1;
    while( _lim <= limit && *i<l ){
      _lim +=gsl_vector_get(a, *i)/sumt;
     (*i)++;
    }
    v8::Local<Value> exception = trycatch.Exception();
    if (!exception.IsEmpty()) {
      v8::String::Utf8Value exception_str(exception);
      printf("Exception: %s\n", *exception_str);
    }
 }
 // the function that read the data from info
  gsl_matrix * read_matrix(const Nan::FunctionCallbackInfo<v8::Value>& info){
    v8::TryCatch::TryCatch trycatch;

    double x =0; int i,j,l,m,n;
      Handle<Array> array, *_array;
   // If the arg is a array, we build the gsl_matrix object
   if (info[0]->IsArray()) {
      array = Handle<Array>::Cast(info[0]);
     m = (int) array->Length();
    //  printf("m= %d\n",m );

     _array = new Handle<Array>[m];

       _array[0]=Handle<Array>::Cast(array->Get(0));
     n= (int) _array[0]->Length();
     if (n == 0 || m ==0) {
       gsl_matrix *M = gsl_matrix_calloc(1, 1) ;
       return M;
     }
     gsl_matrix *M = gsl_matrix_calloc(m, n) ;
     for (i = 0; i < m; i++) {
       _array[i] = Handle<Array>::Cast(array->Get(i));
       l = (int) _array[i]->Length();

       for ( j = 0; j < l; j++) {
        x = _array[i]->Get(j)->NumberValue();
        // printf(" data = %f con  i = %d y j = %d\n", x,i,j);
         gsl_matrix_set(M, (size_t) i, (size_t) j, x);
       }
     }
     return M;
   }
   gsl_matrix * M = gsl_matrix_calloc(1, 1);
   v8::Local<Value> exception = trycatch.Exception();
   if (!exception.IsEmpty()) {
     v8::String::Utf8Value exception_str(exception);
     printf("Exception: %s\n", *exception_str);
   }
   return M ;
 }
 // the function that read the data from info
  gsl_vector * read_vector(const Nan::FunctionCallbackInfo<v8::Value>& info){
    v8::TryCatch::TryCatch trycatch;

    double x =0; int i,n;
      Handle<Array> array;
      // If the arg is a array, we build the gsl_matrix object
      if (info[2]->IsArray()) {
      array = Handle<Array>::Cast(info[2]);
     n = (int) array->Length();
     gsl_vector *V = gsl_vector_calloc(n) ;
     for (i = 0; i < n; i++) {
       x = array->Get(i)->NumberValue();
         gsl_vector_set(V, (size_t) i, x);
       }
       return V;
     }
     gsl_vector *V = gsl_vector_calloc(1);
     v8::Local<Value> exception = trycatch.Exception();
     if (!exception.IsEmpty()) {
       v8::String::Utf8Value exception_str(exception);
       printf("Exception: %s\n", *exception_str);
     }
      return V;
    }

 void _sqrtf(const Nan::FunctionCallbackInfo<v8::Value>& info){
   double x = sqrt( info[0]->NumberValue());
   info.GetReturnValue().Set(Nan::New(x));
}
//The function that shift the datas to media value and normalize to sigma
 void normalization(gsl_matrix * M, gsl_vector * Media, gsl_vector * Sigma){
   v8::TryCatch::TryCatch trycatch;

    int column = (int) M->size2,
    m= (int) M->size1,i; double m_sqrt= (double) m;
    gsl_vector_view   Column[column] ;
    double media = 0, sigma = 0, _sigma=1;
    gsl_vector *_Ident=  gsl_vector_alloc(m);
    gsl_vector *Ident=   gsl_vector_alloc(m);
    gsl_vector_set_all(_Ident, 1);
    gsl_vector_set_all (Ident, 1);
    for ( i = 0; i < column; i++) {
      // We read the column i from M
      Column[i] = gsl_matrix_column (M, (size_t) i);
     media = gsl_vector_get(Media, (size_t) i);
     sigma = gsl_vector_get(Sigma, (size_t) i);
      // The sigma^-1 is calculated
      _sigma = 1/sigma;
      _sigma = _sigma/m_sqrt;
      gsl_vector_scale(Ident,media);
      // the measures are translated where the media es zero
      gsl_vector_sub(&Column[i].vector, Ident) ;
      // the measures are scaled to sigma.
      gsl_vector_scale(&Column[i].vector, _sigma) ;
      sigma = 0;media=0;
    }
    gsl_vector_free(Ident);gsl_vector_free (_Ident);
    v8::Local<Value> exception = trycatch.Exception();
    if (!exception.IsEmpty()) {
      v8::String::Utf8Value exception_str(exception);
      printf("Exception: %s\n", *exception_str);
    }


 }

 void vnorm( gsl_vector* S, double * sum) {
   v8::TryCatch::TryCatch trycatch;
    int n =(int)  S->size;
    gsl_vector * ident = gsl_vector_calloc((size_t)n);
    gsl_vector_set_all(ident,1);
    Dot(S,ident,*sum);
    v8::Local<Value> exception = trycatch.Exception();
    if (!exception.IsEmpty()) {
      v8::String::Utf8Value exception_str(exception);
      printf("Exception: %s\n", *exception_str);
    }
 }

 void dim_red( gsl_matrix *V ,gsl_matrix* _V_ ,gsl_vector* S, gsl_vector* _S_,int *count) {
   v8::TryCatch::TryCatch trycatch;

    //With the limit given the dimension is reduced
    gsl_vector_view   _S =
    gsl_vector_subvector(S, 0, (size_t) *count);
    gsl_vector_memcpy (_S_, &_S.vector);
    //The dimension is reduced
    gsl_matrix_view _V = gsl_matrix_submatrix (V,0,0,V->size1, (size_t) *count);
    gsl_matrix_memcpy(_V_, &_V.matrix);
    v8::Local<Value> exception = trycatch.Exception();
    if (!exception.IsEmpty()) {
      v8::String::Utf8Value exception_str(exception);
      printf("Exception: %s\n", *exception_str);
    }

 }
      void probability(const Nan::FunctionCallbackInfo<v8::Value>& info){
        v8::TryCatch::TryCatch trycatch;
          int i,n,count;
          // the array is read from info and stored into matrix M
           gsl_matrix *_V_ = read_matrix(info);
           gsl_vector *_S_ = read_vector(info);
           // the size of matrix is read
           count = (int) _V_->size1; n = (int) _V_->size2;
          // Define the vectors Media and Sigma, The last will store
          // the madia and and sigma values to every variable.
          gsl_vector * Media=gsl_vector_calloc(n),
          * Sigma=gsl_vector_calloc(n) ;
          // We read the variables from the matrix data, and we make
          //the media = 0 normalize the measures to sigma.
          Handle<Array> stats=Handle<Array>::Cast(info[3]);
          Handle<Array> stats_media=Handle<Array>::Cast(stats->Get(0));
          Handle<Array> stats_sigma=Handle<Array>::Cast(stats->Get(1));
          double sigma ;
          for (i = 0; i < n; i++) {
            gsl_vector_set(Media,i,stats_media->Get(i)->NumberValue());
          sigma = 1/stats_sigma->Get(i)->NumberValue();
            gsl_vector_set(Sigma,i,sigma);
          }
          //with the arguments passed the probability of succed is calculated
          Handle<Array> H_Arg=Handle<Array>::Cast(info[1]);
          gsl_vector * Arg = gsl_vector_calloc(n),
          *Arg_red = gsl_vector_calloc((size_t) count);
          // The vector Arg is build grom info given
          for ( i = 0; i < n; i++) {
            gsl_vector_set(Arg,i,H_Arg->Get(i)->NumberValue());
          }
          // printf("datos antes de substraer media  es\n" );
          // gsl_vector_fprintf (stdout, Arg, "%f");
          gsl_vector_sub(Arg,Media);
          // printf("datos despues de substraer media  es\n" );
          // gsl_vector_fprintf (stdout, Arg, "%f");
          // is scaled to sigma
          gsl_vector_mul(Arg,Sigma);
          // A matrix is build from vector Arg
          // printf("datos despues escalar con sigma  es\n" );
          // gsl_vector_fprintf (stdout, Arg, "%f");
          gsl_matrix_view _Arg=
          gsl_matrix_view_array(Arg->data, n,1);
          // The vector of arg is build, where the dimension is <= that orginal
          // dimension
          gsl_matrix_view _Arg_red =
           gsl_matrix_view_array(Arg_red->data, (size_t) count, 1);
          gsl_matrix *V_T= _V_;
          // The Arg reduced is calculated from X_red = A^T X
          // where the matrix A is given for the condition of dimension reducing
          gsl_blas_dgemm(CblasNoTrans, CblasNoTrans,
                        1.0,V_T,&_Arg.matrix,0.0,&_Arg_red.matrix);
          // printf("datos reducido es\n" );
          // gsl_vector_fprintf (stdout, Arg_red, "%f");
          // double x=normal_pdf(Arg_red,_S_);
          double x=normal_cdf_Q(Arg_red,_S_);
          v8::Local<v8::Number> num = Nan::New(x);
          gsl_matrix_free (V_T);
          gsl_vector_free (Arg);gsl_vector_free (Arg_red);
          info.GetReturnValue().Set(num);
          v8::Local<Value> exception = trycatch.Exception();
          if (!exception.IsEmpty()) {
            v8::String::Utf8Value exception_str(exception);
            printf("Exception: %s\n", *exception_str);
          }
      }
      void print_M(gsl_matrix * M){
        v8::TryCatch::TryCatch trycatch;

          printf("<<<<<<<<<=============The matrix is ===============>>>>>>\n" );
          int m = (int ) M->size1,n = (int ) M->size2 ;
          printf("{");
          for (int i = 0; i < m; i++) {
            printf("|");
            for (int j = 0; j < n; j++) {
            printf("%f ", gsl_matrix_get(M, i, j));
            }
            printf("|\n");
          }
          printf("}\n");
          printf("<<<<<<<<<============================>>>>>>\n" );
          v8::Local<Value> exception = trycatch.Exception();
          if (!exception.IsEmpty()) {
            v8::String::Utf8Value exception_str(exception);
            printf("Exception: %s\n", *exception_str);
          }
      }

// the pca analysis, the arguments are (@MatrixData, @LimitToReduce, @StatsArray)
void gsl_pca (const Nan::FunctionCallbackInfo<v8::Value>& info) {
      v8::TryCatch::TryCatch trycatch;

      int i,j,n, m; gsl_matrix_view A;
      // the array is read from info and stored into matrix M
       printf("reading matrix\n" );
       gsl_matrix *M = read_matrix(info);

       // the size of matrix is read
        n = (int) M->size2;  m = (int) M->size1;
        if (n ==0 || m==0) {
          printf("There is not data enougth  for PCA\n" );
          v8::Local<v8::Number> num = Nan::New(0);
            v8::Local<v8::Object> obj = Nan::New<v8::Object>();
            obj->Set(Nan::New("S_corr").ToLocalChecked(),num);
            obj->Set(Nan::New("V_trans").ToLocalChecked(),num);
            // The return object
            info.GetReturnValue().Set(obj);

        }
      // Define the vectors Media and Sigma, The last will store
      // the madia and and sigma values to every variable.
      gsl_vector * Media=gsl_vector_calloc(n),
      * Sigma=gsl_vector_calloc(n) ;
      // We read the variables from the matrix data, and we make
      //the media = 0 normalize the measures to sigma.
        printf("reading media and sigma\n" );
      Handle<Array> stats=Handle<Array>::Cast(info[2]);
      Handle<Array> stats_media=Handle<Array>::Cast(stats->Get(0));
      Handle<Array> stats_sigma=Handle<Array>::Cast(stats->Get(1));
      for (i = 0; i < n; i++) {
        gsl_vector_set(Media,i,stats_media->Get(i)->NumberValue());
        gsl_vector_set(Sigma,i,stats_sigma->Get(i)->NumberValue() );
      }

      // A = gsl_matrix_view_array(Sigma->data, Sigma->size,1);
      // print_M(  &A.matrix);
        printf("normalazing data\n" );
      normalization(M,Media,Sigma);
      // printf("la matrix despues de normalizar es\n" );
      // gsl_matrix_fprintf (stdout, M, "%f");
      gsl_matrix *V = gsl_matrix_calloc( n,  n) ;
        gsl_matrix *X = gsl_matrix_calloc(n, n) ;
        gsl_vector *work = gsl_vector_calloc((size_t) n);
      gsl_vector *S = gsl_vector_calloc((size_t) n);
      // The SVD is done
      //gsl_linalg_SV_decomp_jacobi(M,V,S);
      printf("SVD descompisiton\n" );
      gsl_linalg_SV_decomp_mod(M, X, V,S, work);
      int l =((int) S->size);
      for ( i = 0; i < l; i++) {
        S->data[i] = sqrt(S->data[i]);
      }
      A = gsl_matrix_view_array(S->data, S->size,1);
      print_M(  &A.matrix);
      double * Sum = new double;
      vnorm(S,Sum);
      printf("la suma toatal es %f\n",*Sum );
      int* count= new int;
      // The limite for counting variables is read.
      double _limit = info[1]->NumberValue();
      // count of number of principal variables
      couting_vec(S,_limit,*Sum, count);
      printf("la cuenta es %d y el limite es%f \n",*count ,_limit);
       gsl_vector* _S_ = gsl_vector_calloc((size_t) *count);
       gsl_matrix* _V_= gsl_matrix_calloc(V->size1 ,(size_t) *count);
       dim_red( V ,_V_ ,S,_S_,count);
       printf("print a _V_\n");
       print_M(_V_);
       printf("print a _S_\n");
        A = gsl_matrix_view_array(_S_->data, _S_->size,1);
       print_M(  &A.matrix);
      // The object to return are build
      v8::Local<v8::Object> obj = Nan::New<v8::Object>();
      Handle<Array> R_array = Nan::New<v8::Array>((size_t) *count);
      Handle<Array> V_array = Nan::New<v8::Array>((size_t) *count);
      Handle<Array> *V2_array = new  Handle<Array>[*count];
        printf("Build objects to return\n" );
      for (i = 0; i <  *count; i++) {
        R_array->Set(i, Nan::New(_S_->data[i]));
        V2_array[i]= Nan::New<v8::Array>(n);
        for ( j = 0; j < n; j++) {
            V2_array[i]->Set(j, Nan::New(gsl_matrix_get(_V_,j,i)));
        }
        V_array->Set(i,V2_array[i]);
      }
      // unallocate the space used by the matrix
      gsl_matrix_free (M);gsl_matrix_free (_V_);
      gsl_vector_free (Sigma);gsl_vector_free (Media);
      gsl_vector_free (S);gsl_vector_free (_S_);

      // The object to return is done
      obj->Set(Nan::New("S_corr").ToLocalChecked(),R_array);
      obj->Set(Nan::New("V_trans").ToLocalChecked(),V_array);
      // The return object
      info.GetReturnValue().Set(obj);
      v8::Local<Value> exception = trycatch.Exception();
      if (!exception.IsEmpty()) {
        v8::String::Utf8Value exception_str(exception);
        printf("Exception: %s\n", *exception_str);
      }
  }

  void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
  	v8::Local<v8::Object> obj = Nan::New<v8::Object>();
    v8::Local<v8::FunctionTemplate> tpl =
    Nan::New<v8::FunctionTemplate>(gsl_pca);
  	v8::Local<v8::Function> fn = tpl->GetFunction();
    v8::Local<v8::FunctionTemplate> tpl2 =
    Nan::New<v8::FunctionTemplate>(probability);
    v8::Local<v8::Function> fn2 = tpl2->GetFunction();
  	obj->Set(Nan::New("pca").ToLocalChecked(),fn);
    obj->Set(Nan::New("p_x").ToLocalChecked(),fn2);
  	module->Set(Nan::New("exports").ToLocalChecked(),obj);
  }

NODE_MODULE(newton, Init)
