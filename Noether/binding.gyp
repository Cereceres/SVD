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
            'OTHER_CPLUSPLUSFLAGS' : ['-std=c++11'],

            },

        }],
      ],
      "include_dirs": ["<!(node -e \"require('nan')\")",
         "-I/usr/local/include"
      ],
      "libraries": [
        "-lgsl -lgslcblas -lm","-L/usr/local/lib"]
    },
  ],
}
