

{
  "targets": [
    {
      "target_name": "Noether",
      "sources": [
        "../fromcpp/Noether.cc"
      ],'cflags': [''],
      "include_dirs": ["<!(node -e \"require('nan')\")",
         "-I/usr/local/include"
      ],
      "libraries": [
        "-lgsl -lgslcblas -lm","-L/usr/local/lib"
      ]
    }
  ]
}
