/*
* Zoom Images, Get Date and Shadow
* ========================================================================== */

(function() {
  /* variables */
  var shadow = document.getElementById('shadow');
  var images = document.querySelectorAll('.blog-content a img');
  var imageHeight = window.innerHeight - 20;

  /* events */
  shadow.addEventListener('click', resetShadow, false);
  window.addEventListener('keydown', resetStyles, false);
  window.addEventListener('resize', refreshImageSizes, false);

  /* functions */
  setDate();
  toggleImages();


  function setDate() {
    var currentYear = document.querySelector('.full-year');
    if (currentYear) {
      currentYear.innerHTML = new Date().getFullYear();
    }
  }

  function refreshImageSizes() {
    // select all images
    [].forEach.call(images, function(img) {
      // if image zoomed
      if (img.classList.contains('img-popup')) {
        img.style.maxHeight = imageHeight + 'px';
        img.style.marginLeft = '-' + (img.offsetWidth / 2) + 'px';
        img.style.marginTop = '-' + (img.offsetHeight / 2) + 'px';
      }
    });
  }

  function resetShadow() {
    shadow.style.display = 'none';
    resetAllImages();
  }

  function resetStyles(event) {
    if (event.keyCode == 27) {
      event.preventDefault();
      shadow.style.display = 'none';
      resetAllImages();
    }
  }

  function resetAllImages() {
    [].forEach.call(images, function(img) {
      img.classList.remove('img-popup');
      img.style.cursor = 'zoom-in';
      img.style.marginLeft = 'auto';
      img.style.marginTop = 'auto';
    });
  }

  function toggleImages() {
    [].forEach.call(images, function(img) {
      img.addEventListener('click', function(event) {
        event.preventDefault();
        img.classList.toggle('img-popup');
        if (img.classList.contains('img-popup')) {
          img.style.cursor = 'zoom-out';
          img.style.maxHeight = imageHeight + 'px';
          img.style.marginLeft = '-' + (img.offsetWidth / 2) + 'px';
          img.style.marginTop = '-' + (img.offsetHeight / 2) + 'px';
          shadow.style.display = 'block';
        } else {
          img.style.cursor = 'zoom-in';
          img.style.maxHeight = '100%';
          img.style.marginLeft = 'auto';
          img.style.marginTop = 'auto';
          shadow.style.display = 'none';
        }
      });
    });
  }
})();


/*
* Aside Resize
* ========================================================================== */

(function() {
  var aside = document.querySelector('.sidebar');
  var mainContainer = document.querySelectorAll('.content-wrapper');
  var switcher = document.getElementById('switcher');

  switcher.addEventListener('click', slide, false);


  function slide() {
    aside.classList.add('transition-divs');
    aside.classList.toggle('aside-left');
    [].forEach.call(mainContainer, function(c) {
      c.classList.add('transition-divs');
      c.classList.toggle('centering');
    });
  }
})();

/*
 * cowsay
* ========================================================================== */
function cowsay(msg) {
  let text=msg.split('\n');
  let numLinesPerText=text.length-1;
  let numCharsPerLine=0;
  let cow='        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||';
  let result ="";

  //Auxiliar function
  function lineSize(string) {
    let size = 0;
    for(let i = 0; i < string.length; i++) {
        if (string[i] === '\t') {
            size += (8-((size+2) % 8))
        } else {
            size++;
        }
    }
    return size;
  }

  text.forEach(function(line, idx, all){
    if (line.length > 0) {
      let lineLenght = lineSize(line);
      if (lineLenght > numCharsPerLine) {
        numCharsPerLine = lineLenght;
      }
    }
  });

  let header=` ${"-".repeat(numCharsPerLine+2)} \n`;
  let footer=` ${"-".repeat(numCharsPerLine+2)} \n`;

  result = header;
  text.forEach(function(line, idx, all){
    newLine = line.replace("\t", "      ");
    let spaces = " ".repeat(numCharsPerLine - lineSize(line));
    if (line.length > 1) {
      if (numLinesPerText > 1) {
        if (idx === 0) {
          result += `/ ${line}${spaces} \\\n`;
        } else if (idx === numLinesPerText - 1) {
          result += `\\ ${line}${spaces} /\n`;
        } else {
          result += `| ${line}${spaces} |\n`;
        }
      } else {
        result += `< ${line}${spaces} >\n`;
      }
    }
  });
  result += `${footer}`;
  result += `${cow}`;
  return result;
}

/*
 * fortune | cowsay
* ========================================================================== */
function getFortune(fortunes) {
  let idCategory =  Math.floor(Math.random() * fortunes.length);
  let idFortune = Math.floor(Math.random() * fortunes[idCategory].list.length);
  let fortune = fortunes[idCategory].list[idFortune];

  document.getElementById('fortune-msg').innerHTML = cowsay(fortune.text);
  document.getElementById('fortune-details').innerHTML = `${String('\t\t -- ')}${String(fortune.author)}`;
  document.getElementById('fortune-category').innerHTML = `${String('\t\t * ')}${String(fortunes[idCategory].name.split('/').pop())}`;;
}
