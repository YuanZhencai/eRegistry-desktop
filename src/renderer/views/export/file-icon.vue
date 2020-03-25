<template>
    <span class="file-icon">
         <a-icon v-if="'file' === ext"
                 theme="filled"
                 :style="{ fontSize: '24px',color: '#596B93' }"
                 :type="'file'"/>
        <a-icon v-if="'zip' === ext"
                theme="filled"
                :style="{ fontSize: '24px',color: '#50749A' }"
                :type="'file-zip'"/>
        <a-icon v-if="'xls' === ext || 'xlsx' === ext "
                theme="filled"
                :style="{ fontSize: '24px',color: '#2FB983' }"
                :type="'file-excel'"/>
    </span>

</template>

<script>
    import { extension } from '../../utils'

    export default {
      name: 'file-icon',
      props: {
        filename: {
          type: String,
          default: function() {
            return ''
          }
        }
      },
      data() {
        return {
          ext: 'file'
        }
      },
      mounted() {
        const ext = extension(this.filename)
        if (ext) {
          this.ext = ext
        }
      }
    }
</script>

<style scoped>
    .file-icon {
        margin: 2px 3px 0 0;
        float: left;
    }
</style>