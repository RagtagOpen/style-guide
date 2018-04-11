(function() {
  'use strict';

  function guid() {
    return 'xxxxxxxx'.replace(/[x]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  var script = (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  var mark = document.getElementById('mark').dataset.white;
  var marks = {
    black: document.getElementById('mark').dataset.black,
    gradient: document.getElementById('mark').dataset.gradient,
    white: document.getElementById('mark').dataset.white
  };
  var preview = document.createElement('div');
  var options = document.createElement('div');
  preview.className = 'builder-preview';
  preview.innerHTML = mark;
  var svg = preview.querySelector('.builder-mark');
  script.parentNode.insertBefore(preview, script);
  var heightRatio = parseFloat(svg.getBBox().height) / parseFloat(svg.getBBox().width);
  var widthRatio = parseFloat(svg.getBBox().width) / parseFloat(svg.getBBox().height);
  options.className = 'builder-options';
  var optionsWrapper = document.createElement('div');
  optionsWrapper.className = 'wrapper';
  preview.parentNode.insertBefore(optionsWrapper, preview.nextSibling);
  optionsWrapper.appendChild(options);
  options.innerHTML = '<h2>Options</h2>';
  var textAbove = document.createElement('div');
  textAbove.className = 'builder-text';
  preview.insertBefore(textAbove, preview.firstChild);
  var textBelow = document.createElement('div');
  textBelow.className = 'builder-text';
  preview.appendChild(textBelow);

  var inputs = {
    width: document.createElement('input'),
    height: document.createElement('input'),
    style: document.createElement('select'),
    textAbove: document.createElement('input'),
    textBelow: document.createElement('input')
  };

  inputs.width.type = 'number';
  inputs.width.id = 'id_width';
  inputs.width.value = 1200;
  inputs.width.dataset.label = 'Width';
  inputs.width.pattern = '\\d+';
  inputs.width.step = 1;
  inputs.height.type = 'number';
  inputs.height.id = 'id_height';
  inputs.height.value = 630;
  inputs.height.dataset.label = 'Height';
  inputs.height.pattern = '\\d+';
  inputs.height.step = 1;
  inputs.style.id = 'id_style';
  inputs.style.value = 'transparent';
  inputs.style.dataset.label = 'Style';
  inputs.textAbove.type = 'text';
  inputs.textAbove.id = 'id_text';
  inputs.textAbove.dataset.label = 'Text Above Mark';
  inputs.textAbove.value = '';
  inputs.textBelow.type = 'text';
  inputs.textBelow.id = 'id_text';
  inputs.textBelow.dataset.label = 'Text Below Mark';
  inputs.textBelow.value = '';

  var styles = {
    gradient: 'Orange Background, Black Text',
    black: 'Black Background, White Text',
    white: 'White Background, Black Text'
    // transparent: 'Transparent Background, Black Text',
    // 'transparent-inverse': 'Transparent Background, White Text'
  };

  for (var style in styles) {
    var option = document.createElement('option');
    option.value = style;
    option.innerHTML = styles[style];
    inputs.style.appendChild(option);
  }

  for (var input in inputs) {
    var input = inputs[input];
    var label = document.createElement('label');
    label.for = input.id;
    label.innerHTML = input.dataset.label;
    label.className = 'form-control-label';
    input.className = 'form-control';
    var div = document.createElement('div');
    div.className = 'form-field form-field-' + input.id.replace(/^id_/, '');
    div.appendChild(label);
    div.appendChild(input);
    options.appendChild(div);
  }

  var buttons = document.createElement('div');
  buttons.className = 'form-buttons';

  var updateButton = document.createElement('button');
  updateButton.type = 'button';
  updateButton.innerHTML = 'Update';
  updateButton.className = 'button';

  var downloadButton = document.createElement('a');
  downloadButton.innerHTML = 'Download';
  downloadButton.className = 'button';
  downloadButton.href = '#';

  buttons.appendChild(updateButton);
  buttons.appendChild(downloadButton);

  options.appendChild(buttons);

  function handleSizeChange() {
    downloadButton.setAttribute('disabled', true);

    var x = inputs.width.value;
    var y = inputs.height.value;

    if (inputs.style.value === 'transparent' || inputs.style.value === 'transparent-inverse') {
      preview.style.padding = 0;
    } else {
      preview.style.padding = x * heightRatio * 0.25 + 'px';
    }

    var svgHeight = svg.getClientRects()[0].height;
    if (inputs.textAbove.value) {
      textAbove.style.marginBottom = svgHeight * 0.25 + 'px';
      textAbove.style.fontSize = Math.round(svgHeight * 0.25) + 'px';
    } else {
      textAbove.style.marginBottom = 0;
    }
    if (inputs.textBelow.value) {
      textBelow.style.marginTop = svgHeight * 0.25 + 'px';
      textBelow.style.fontSize = Math.round(svgHeight * 0.25) + 'px';
    } else {
      textBelow.style.marginTop = 0;
    }

    html2canvas(preview).then(function(canvas) {
      downloadButton.href = canvas.toDataURL('image/png');
      downloadButton.download = 'ragtag-logo-' + guid() + '.png';
      downloadButton.removeAttribute('disabled');
    });
  }

  inputs.width.addEventListener('change', function() {
    preview.style.width = inputs.width.value + 'px';
    handleSizeChange();
  });

  inputs.height.addEventListener('change', function() {
    preview.style.height = inputs.height.value + 'px';
    handleSizeChange();
  });

  inputs.textAbove.addEventListener('change', function() {
    textAbove.innerHTML = inputs.textAbove.value;
    handleSizeChange();
  });

  inputs.textBelow.addEventListener('change', function() {
    textBelow.innerHTML = inputs.textBelow.value;
    handleSizeChange();
  });

  inputs.style.addEventListener('change', function() {
    preview.className = 'builder-preview builder-preview-background-' + inputs.style.value;
    var parser = new DOMParser();
    var newSvg = parser.parseFromString(marks[inputs.style.value], 'image/svg+xml');
    newSvg = newSvg.querySelector('.builder-mark');
    preview.replaceChild(newSvg, svg);
    svg = newSvg;
    handleSizeChange();
  });

  for (var input in inputs) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);
    inputs[input].dispatchEvent(evt);
  }
})();
