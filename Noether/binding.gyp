{

 'make_global_settings': [
    ['CXX','/usr/bin/clang++'],
    ['LINK','/usr/bin/clang++'],
  ],
  'targets': [
    {
    'target_name': 'noether',
    'product_name': 'noether',
    'sources': [
      'Noether.cc',
    ],
      'conditions': [
        [ 'OS=="mac"', {

          'xcode_settings': {
              'CLANG_CXX_LANGUAGE_STANDARD': 'gnu++11',  # -std=gnu++11
  },

        }],
      ],"cflags_cc":['-stdlib=libc++'],
      "include_dirs": ["<!(node -e \"require('nan')\")",
         "-I/usr/local/include"
      ],
      "libraries": [
        "-lgsl -lgslcblas -lm -lstdc++","-L/usr/local/lib"]
    },
  ],
}
