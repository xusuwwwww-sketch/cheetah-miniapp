<script>
  export default {
    onLaunch: function () {
      console.log('猎豹出海工具箱启动')
    }
  }
</script>

<style>
  page { background: #f6f7fb; }
  button { border: none; padding: 0; background: transparent; }
  button::after { border: none; }
  /* rich-text 图片自适应宽度 */
  rich-text img { max-width: 100% !important; width: 100% !important; height: auto !important; border-radius: 8px; display: block; margin: 8px 0; box-sizing: border-box; }
  rich-text p { margin: 4px 0; line-height: 1.8; }
  rich-text h1, rich-text h2, rich-text h3 { font-weight: 700; color: #1a1a2e; margin: 12px 0 6px; }
  rich-text h1 { font-size: 18px; }
  rich-text h2 { font-size: 16px; }
  rich-text h3 { font-size: 15px; }
  rich-text ul, rich-text ol { padding-left: 20px; margin: 6px 0; }
  rich-text li { margin: 4px 0; line-height: 1.8; }
</style>
