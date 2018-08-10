HTML代码：
<input id="file" type="file">

JS代码：
<script>
    var eleFile = document.querySelector('#file')
    eleFile.addEventListener('change', chooseImage(e))
    function chooseImage(e) {
      const _this = this
      const file = e.target.files[0]
      // formdata对象可以模拟表单提交的数据
      const formdata = new FormData()
      const reader = new FileReader()
      const img = new Image()
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (file.type.indexOf('image') === 0) {
        reader.readAsDataURL(file)
      }
      reader.onload = (e) => {
        img.src = e.target.result
      }
      // 利用canvas压缩图片再上传
      img.onload = function () {
        // 图片原始尺寸
        const originWidth = this.width
        const originHeight = this.height
        // 最大尺寸限制
        const maxWidth = 400
        const maxHeight = 400
        // 目标尺寸
        let targetWidth = originWidth
        let targetHeight = originHeight
        // 图片尺寸超过400x400的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            targetWidth = maxWidth
            targetHeight = Math.round(maxWidth * (originHeight / originWidth))
          } else {
            targetHeight = maxHeight
            targetWidth = Math.round(maxHeight * (originWidth / originHeight))
          }
        }
        canvas.width = targetWidth
        canvas.height = targetHeight
        context.clearRect(0, 0, targetWidth, targetHeight)
        context.drawImage(img, 0, 0, targetWidth, targetHeight)
        canvas.toBlob(async function (blob) {
          // 将图片的二进制blob拼接到formdata对象中
          formdata.append('image', blob)
          const ajaxOpts = {
            contentType: false,
            processData: false
          }
          // 此处调用封装的ajax方法ajaxUpload上传formdata
          const res = await _this.ajaxUpload(formdata, ajaxOpts)
        }, file.type || 'image/png')
      }
    }
  </script>
