<template>
    <div
        class="aheng-upload-dragger"
        :class="{'is-dragover':dragover}"
        @drop.prevent="onDrop"
        @dragover.prevent="onDragover"
        @draglieav.prevent="dragover=false"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "UploadDrag",
    props: {
        disabled: Boolean
    },
    inject: {
        uploader: {
            default: ""
        }
    },
    data() {
        return {
            dragover: false
        };
    },
    methods: {
        onDragover() {
            if (!this.disabled) {
                this.dragover = true;
            }
        },
        onDrop(e) {
            if (this.disabled || !this.uploader) return;
            const accept = this.uploader.accept;
            this.dragover = false;
            this.$emit("file", e.dataTransfer.files);
            // if (!accept) {
            //   this.$emit("file", e.dataTransfer.files);
            //   return;
            // }
            // this.$emit(
            //   "file",
            //   [].slice.call(e.dataTransfer.files).filter(file => {
            //     const { type, name } = file;
            //     const extension =
            //       name.indexOf(".") > -1 ? `.${name.split(".").pop()}` : "";
            //   })
            // );
        }
    }
};
</script>

<style lang="scss" scoped>
</style>