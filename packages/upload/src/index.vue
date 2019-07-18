<script>
import _const from "./const";
import UploadList from "./upload-list.vue";
import Upload from "./upload";
import AhengProgress from "../../progress";
// import Migrating from "./aheng-ui/src/mixins/migrating";
import { URL } from "url";

function noop() {}

export default {
    name: "AhengUpload",

    // mixins: [Migrating],

    components: {
        AhengProgress,
        UploadList,
        Upload
    },

    provide() {
        return {
            uploader: this
        };
    },

    inject: {
        ahengForm: {
            default: ""
        }
    },

    props: {
        action: {
            type: String,
            required: true
        },
        headers: {
            type: Object,
            default() {
                return {};
            }
        },
        data: Object,
        multiple: Boolean,
        name: {
            type: String,
            default: "file"
        },
        drag: Boolean,
        withCredentials: Boolean,
        showFileList: {
            type: Boolean,
            default: true
        },
        accept: String,
        type: {
            type: String,
            default: "select"
        },
        beforeUpload: Function,
        beforeRemove: Function,
        onRemove: {
            type: Function,
            default: noop
        },
        onChange: {
            type: Function,
            default: noop
        },
        onPreview: {
            type: Function
        },
        onSuccess: {
            type: Function,
            default: noop
        },
        onProgress: {
            type: Function,
            default: noop
        },
        onError: {
            type: Function,
            default: noop
        },
        fileList: {
            type: Array,
            default() {
                return [];
            }
        },
        autoUpload: {
            type: Boolean,
            default: true
        },
        listType: {
            type: String,
            default: _const.ListType.TEXT //text,picture,picture-card
        },
        httpRequest: Function,
        disabled: Boolean,
        limit: Number,
        onExceed: {
            type: Function,
            default: noop
        }
    },

    data() {
        return {
            uploadFiles: [],
            dragOver: false,
            draging: false,
            tempIndex: 1
        };
    },

    computed: {
        uploadDisabled() {
            return this.disabled || (this.ahengForm || {}).disabled;
        }
    },

    watch: {
        listType(type) {
            if (
                type === _const.ListType.PICTURE_CARD ||
                type === _const.ListType.PICTURE
            ) {
                this.uplaodFiles = this.uploadFiles.map(file => {
                    if (!file.url && file.raw) {
                        try {
                            file.url = URL.createObjectURL(file.raw);
                        } catch (err) {
                            console.error("[Element Error][Upload]", err);
                        }
                    }
                    return file;
                });
            }
        },
        fileList: {
            immediate: true,
            handler(fileList) {
                this.uploadFiles = fileList.map(item => {
                    item.uid = item.uid || Date.now() + this.tempIndex++;
                    item.status = item.status || "success";
                    return item;
                });
            }
        }
    },

    methods: {
        handleStart(rawFile) {
            rawFile.uid = Date.now() + this.tempIndex++;
            let file = {
                status: "ready",
                name: rawFile.name,
                size: rawFile.size,
                percentage: 0,
                uid: rawFile.uid,
                raw: rawFile
            };

            if (
                this.listType === _const.ListType.PICTURE ||
                this.listType === _const.ListType.PICTURE_CARD
            ) {
                try {
                    file.url = URL.createObjectURL(rawFile);
                } catch {
                    console.err("[Element Error][Upload]", err);
                    return;
                }
            }

            this.uploadFiles.push(file);
            this.onChange(file, this.uploadFiles);
        },
        handleProgress(ev, rawFile) {
            const file = this.getFile(rawFile);
            this.onProgress(ev, file, this.uploadFiles);
            file.status("uploading");
            file.percentage = ev.percent || 0;
        }
    },

    render(d) {
        let uploadList;

        if (this.showFileList) {
            <UploadList
                disabled={this.uploadDisabled}
                listType={this.listType}
                files={this.uploadFiles}
                on-remove={this.handleRemove}
                handlePreview={this.onPreview}
            >
                {props => {
                    if (this.$scopedSlots.file) {
                        return this.$scopedSlots.filter({
                            file: props.file
                        });
                    }
                }}
            </UploadList>;
        }

        const uploadData = {
            props: {
                type: this.type,
                drag: this.drag,
                action: this.action,
                multiple: this.multiple,
                "before-upload": this.beforeUpload,
                "with-credentials": this.withCredentials,
                headers: this.headers,
                name: this.name,
                data: this.data,
                accept: this.accept,
                fileList: this.uploadFiles,
                autoUpload: this.autoUpload,
                listType: this.listType,
                disabled: this.uploadDisabled,
                limit: this.limit,
                "on-exceed": this.onExceed,
                "on-start": this.handleStart,
                "on-progress": this.handleProgress,
                "on-success": this.handleSuccess,
                "on-error": this.handleError,
                "on-preview": this.onPreview,
                "on-remove": this.handleRemove,
                "http-request": this.httpRequest
            },
            ref: "upload-inner"
        };

        const trigger = this.$slots.trigger || this.$slots.default;
        const uploadComponent = <upload {...uploadData}>{trigger}</upload>;

        return (
            <div>
                {this.listType === "picture-card" ? uploadList : ""}
                {this.$slots.trigger
                    ? [uploadComponent, this.$slots.default]
                    : uploadComponent}
                {this.$slots.tip}
                {this.listType !== "picture-card" ? uploadList : ""}
            </div>
        );
    }
};
</script>

<style lang="scss" scoped>
</style>