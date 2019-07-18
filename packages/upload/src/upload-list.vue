<script>
import _const from "./const";
export default {};
</script>

<template>
    <transition-group
        tag="ul"
        :class="[
        'aheng-upload-list',
        'aheng-upload-list--' + listType,
        {'is-disabled': disabled}
        ]"
        name="aheng-list"
    >
        <li
            v-for="file in files"
            :class="['aheng-upload-list__item','is-'+file.status,focusing?'focusing':'']"
            :key="file.uid"
            tabindex="0"
            @keydown.delete="!disabled&&$emit('remove',file)"
            @focus="focusing=true"
            @blur="focusing=false"
            @click="focusing=false"
        >
            <slot :file="file">
                <img
                    class="aheng-upload-list__item-thumbnail"
                    v-if="file.status !== 'uploading' && 
                        [_const.ListType.PICTURE,_const.ListType.PICTURE_CARD].indexOf(listType) > -1"
                    :src="file.url"
                    alt
                />
                <a class="aheng-upload-list__item-name" @click="handleClick(file)">
                    <i class="aheng-icon-document"></i>
                    {{file.name}}
                </a>
                <label class="aheng-upload-list__item-status-label">
                    <i
                        :class="{
                        'aheng-icon-upload-success':true,
                        'aheng-icon-circle-check':listType==='text',
                        'aheng-icon-check':[_const.ListType.PICTURE_CARD,_const.ListType.PICTURE].indexOf(listType)> -1
                    }"
                    ></i>
                </label>
                <i class="aheng-icon-close" v-if="!disabled" @click="$emit('remove',file)"></i>
                <i class="aheng-icon-close-tip" v-if="!disabled">{{t('aheng.upload.deleteTip')}}</i>
            </slot>
        </li>
    </transition-group>
</template>

<style lang="scss" scoped>
</style>