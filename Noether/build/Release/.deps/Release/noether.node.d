cmd_Release/noether.node := /usr/bin/clang++ -bundle -undefined dynamic_lookup -Wl,-search_paths_first -mmacosx-version-min=10.5 -arch x86_64 -L./Release  -o Release/noether.node Release/obj.target/noether/Noether.o -lgsl -lgslcblas -lm -lstdc++ -L/usr/local/lib
