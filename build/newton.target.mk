# This file is generated by gyp; do not edit.

TOOLSET := target
TARGET := newton
DEFS_Debug := \
	'-DNODE_GYP_MODULE_NAME=newton' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION' \
	'-DDEBUG' \
	'-D_DEBUG'

# Flags passed to all source files.
CFLAGS_Debug := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	 \
	-g \
	-O0

# Flags passed to only C files.
CFLAGS_C_Debug :=

# Flags passed to only C++ files.
CFLAGS_CC_Debug := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++0x

INCS_Debug := \
	-I/home/denise/.node-gyp/5.7.1/include/node \
	-I/home/denise/.node-gyp/5.7.1/src \
	-I/home/denise/.node-gyp/5.7.1/deps/uv/include \
	-I/home/denise/.node-gyp/5.7.1/deps/v8/include \
	-I$(srcdir)/node_modules/nan \
	-I$(srcdir)/-I/usr/local/include

DEFS_Release := \
	'-DNODE_GYP_MODULE_NAME=newton' \
	'-D_LARGEFILE_SOURCE' \
	'-D_FILE_OFFSET_BITS=64' \
	'-DBUILDING_NODE_EXTENSION'

# Flags passed to all source files.
CFLAGS_Release := \
	-fPIC \
	-pthread \
	-Wall \
	-Wextra \
	-Wno-unused-parameter \
	-m64 \
	 \
	-O3 \
	-ffunction-sections \
	-fdata-sections \
	-fno-omit-frame-pointer

# Flags passed to only C files.
CFLAGS_C_Release :=

# Flags passed to only C++ files.
CFLAGS_CC_Release := \
	-fno-rtti \
	-fno-exceptions \
	-std=gnu++0x

INCS_Release := \
	-I/home/denise/.node-gyp/5.7.1/include/node \
	-I/home/denise/.node-gyp/5.7.1/src \
	-I/home/denise/.node-gyp/5.7.1/deps/uv/include \
	-I/home/denise/.node-gyp/5.7.1/deps/v8/include \
	-I$(srcdir)/node_modules/nan \
	-I$(srcdir)/-I/usr/local/include

OBJS := \
	$(obj).target/$(TARGET)/fromcpp/Newton.o

# Add to the list of files we specially track dependencies for.
all_deps += $(OBJS)

# CFLAGS et al overrides must be target-local.
# See "Target-specific Variable Values" in the GNU Make manual.
$(OBJS): TOOLSET := $(TOOLSET)
$(OBJS): GYP_CFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_C_$(BUILDTYPE))
$(OBJS): GYP_CXXFLAGS := $(DEFS_$(BUILDTYPE)) $(INCS_$(BUILDTYPE))  $(CFLAGS_$(BUILDTYPE)) $(CFLAGS_CC_$(BUILDTYPE))

# Suffix rules, putting all outputs into $(obj).

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(srcdir)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# Try building from generated source, too.

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj).$(TOOLSET)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

$(obj).$(TOOLSET)/$(TARGET)/%.o: $(obj)/%.cc FORCE_DO_CMD
	@$(call do_cmd,cxx,1)

# End of this set of suffix rules
### Rules for final target.
LDFLAGS_Debug := \
	-pthread \
	-rdynamic \
	-m64

LDFLAGS_Release := \
	-pthread \
	-rdynamic \
	-m64

LIBS := \
	-lgsl -lgslcblas -lm \
	-L/usr/local/lib

$(obj).target/newton.node: GYP_LDFLAGS := $(LDFLAGS_$(BUILDTYPE))
$(obj).target/newton.node: LIBS := $(LIBS)
$(obj).target/newton.node: TOOLSET := $(TOOLSET)
$(obj).target/newton.node: $(OBJS) FORCE_DO_CMD
	$(call do_cmd,solink_module)

all_deps += $(obj).target/newton.node
# Add target alias
.PHONY: newton
newton: $(builddir)/newton.node

# Copy this to the executable output path.
$(builddir)/newton.node: TOOLSET := $(TOOLSET)
$(builddir)/newton.node: $(obj).target/newton.node FORCE_DO_CMD
	$(call do_cmd,copy)

all_deps += $(builddir)/newton.node
# Short alias for building this executable.
.PHONY: newton.node
newton.node: $(obj).target/newton.node $(builddir)/newton.node

# Add executable to "all" target.
.PHONY: all
all: $(builddir)/newton.node

