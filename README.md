# CKEditor5-plugins
基于ckeditor5的，适用于自定义构建的插件包。要使用此插件包，则不建议直接使用官方的classic、document、inline、balloon等构建，建议自定义构建

# features 包含功能
```bash
├── src
│   ├── clear-empty         清除空行;
│   ├── clear-space         清除多余空格;
│   ├── convert-full-half   全角、半角相互转换;
│   ├── extensions          自定义扩展;
│   ├── indent-first        首行缩进;
│   ├── line-height         行高控制;
│   ├── paragraph-spacing   段落间距控制;
│   ├── quick-style         快速排版;
│   ├── simple-adapter      重写官方的SimpleUploadAdapter，支持文件字段自定义;
│   ├── soft-break-to-enter 软换行转硬换行;
```

# Preview 呈现结果
![ckeditor5-plugins build screenshot](./demo.png)

# Usage 食用方法

### installation
```bash
目前自用采用npm私服安装，未发布到npm官方仓库，可以使用如下命令安装：
npm i -S git://git@github.com:letsbug/ckeditor5-plugins.git
```

### custom build
```javascript
// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

// Official plugin packages from Ckeditor
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// ...

// Custom plug-in packages
import IndentFirst from '@hlw/ckeditor5-plugins/src/indent-first';
import ParagraphSpacing from '@hlw/ckeditor5-plugins/src/paragraph-spacing';
import LineHeight from '@hlw/ckeditor5-plugins/src/line-height';
import ClearEmpty from '@hlw/ckeditor5-plugins/src/clear-empty';
import ClearSpace from '@hlw/ckeditor5-plugins/src/clear-space';
import SoftBreakToEnter from '@hlw/ckeditor5-plugins/src/soft-break-to-enter';
import QuickStyle from '@hlw/ckeditor5-plugins/src/quick-style';
import ConvertFullHalf from '@hlw/ckeditor5-plugins/src/convert-full-half';
import Extensions from '@hlw/ckeditor5-plugins/src/extensions';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import SimpleAdapter from '@hlw/ckeditor5-plugins/src/simple-adapter';

export default class DecoupledEditor extends DecoupledEditorBase {}

// Plugins to include in the build.
DecoupledEditor.builtinPlugins = [
  // ...

  IndentFirst,
  ParagraphSpacing,
  LineHeight,
  ClearEmpty,
  ClearSpace,
  SoftBreakToEnter,
  QuickStyle,
  ConvertFullHalf,
  Extensions,
];

DecoupledEditor.defaultConfig = {
  toolbar: {
    items: [
      // ...

      '|',
      'indentFirst', 'lineHeight', 'paragraphSpacing', '|',
      'removeFormat', 'convertFullHalf', 'clearEmpty', 'clearSpace', 'softBreakToEnter', '|',
      'quickStyle'
    ]
  }
}
```

### usages
以下例子使用 [https://github.com/letsbug/ckeditor5-build-full](https://github.com/letsbug/ckeditor5-build-full) 构建包进行举例

###### html
```html
<div class="editor-wrapper">
  <div class="editor-toolbar"></div>
  <div class="editor-main">
	<div class="editor-body ck ck-content">
      <!-- ... -->
    </div>
  </div>
</div>

<script src="your dir/ckeditor.js"></script>
```

###### css
```css
.editor-toolbar {
  position: sticky;
  z-index: 10;
  top: 0;
}

.editor-main {
  background-color: #f2f2f2;
  padding: 20px;
  border-style: solid;
  border-width: 0 1px 0 1px;
  border-color: #ccc;
}

.editor-body {
  background-color: white;
  padding: 30px !important;
  width: 650px !important;
  margin: 0 auto;
}

.editor-body:not(:focus) {
  border: solid 1px #ccc !important;
}

.editor-footer {
  border: solid 1px #ccc;
}
```

###### js
```javascript
/**
 * 自定义的外部扩展
 *
 * @param name {String} 区别于CKEditor5官方构建，可以使用editor.execute(name)直接触发，不允许重复
 * @param label {String} 鼠标指向时的tooltip提示
 * @param icon {String} 工具栏图标（只支持svg字符串）
 * @param command {(elements: [Element](https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_element-Element.html)) => any} 该自定义扩展按钮的点击回调
 */
const extensions = [{ name: 'demo', label: '...', icon: '...', command: function () { /*...*/ } }];
const configs = {
  toolbar: {
    items: [
      // ...

      // your extensions names
      'demo'
    ]
  },
  extensions
}

CKEDITOR.DocumentBuild.create(document.querySelector('.editor-body'), configs).then(editor => {
  document.querySelector('.editor-toolbar').appendChild(editor.ui.view.toolbar.element);
});
```

