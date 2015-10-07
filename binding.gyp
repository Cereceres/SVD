
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "gsl_test.cc"
      ],
      "include_dirs": ["<!(node -e \"require('nan')\")",
         "-I/usr/local/include"
      ],
      "libraries": [
        "-lgsl", "-L/usr/local/lib"
      ]
    }
  ]
}
