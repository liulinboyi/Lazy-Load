// function LazyLoad (el, options) {
//     console.log("进入")
//     if (!(this instanceof LazyLoad)) {
//         console.log("console.log(!(this instanceof LazyLoad))",!(this instanceof LazyLoad))
//       return new LazyLoad(el)
//     }
  
//     this.setting = Object.assign({}, { src: 'data-src', srcset: 'data-srcset', selector: '.lazyload' }, options)
//     console.log("this.setting",this.setting)
//     if (typeof el === 'string') {
//     //   console.log("el",el)
//       el = document.querySelectorAll(`${el}`)
//     //   console.log("el",el)
//     }
//     this.images = Array.from(el)
  
//     this.listener = this.loadImage()
//     this.listener()
//     this.initEvent()
//   }
  
//   LazyLoad.prototype = {
//     loadImage () {
//       return throttle(function () {
//         let startIndex = 0
//         while (startIndex < this.images.length) {
//           const image = this.images[startIndex]
//         //   console.log("image",image)
//           if (isElementInViewport(image)) {
//             const src = image.getAttribute(this.setting.src)
//             const srcset = image.getAttribute(this.setting.srcset)
//             if (image.tagName.toLowerCase() === 'img') {
//               if (src) {
//                 image.src = src
//               }
//               if (srcset) {
//                 image.srcset = srcset
//               }
//             } else {
//               image.style.backgroundImage = `url(${src})`
//             }
//             this.images.splice(startIndex, 1)
//             continue
//           }
//           startIndex++
//         }
        
//         if (!this.images.length) {
//           this.destroy()
//         }
//       }).bind(this)
//     },
//     initEvent () {
//       window.addEventListener('scroll', this.listener, false)
//     },
//     destroy () {
//       window.removeEventListener('scroll', this.listener, false)
//       this.images = null
//       this.listener = null
//     }
//   }



function LazyLoad (images, options = {}) {
    if (!(this instanceof LazyLoad)) {
      return new LazyLoad(images, options)
    }
    this.setting = Object.assign({}, { src: 'data-src', srcset: 'data-srcset', selector: '.lazy' }, options)
    this.images = document.querySelectorAll(this.setting.selector)
    console.log(this.images)
    this.observer = null
    this.init()
  }
  
  LazyLoad.prototype.init = function () {
    let self = this
    let observerConfig = {
      root: null,
      rootMargin: '0px',
      threshold: [0]
    }
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target
        // console.log("target",target)
        console.log("entry.isIntersecting",entry.isIntersecting)
        console.log("entry.intersectionRatio",entry.intersectionRatio)
        if (entry.intersectionRatio > 0) {
            
          this.observer.unobserve(target)
          const src = target.getAttribute(this.setting.src)
          const srcset = target.getAttribute(this.setting.srcset)
          if ('img' === target.tagName.toLowerCase()) {
            if (src) {
              target.src = src
            }
            if (srcset) {
              target.srcset = srcset
            }
          } else {
            target.style.backgroundImage = `url(${src})`
          }
        }
      })
    }, observerConfig)
  
    this.images.forEach(image => this.observer.observe(image))
  }
  





  function throttle (fn, interval = 500) {
    let timer = null
    let firstTime = true
  
    return function (...args) {
      if (firstTime) {
        // 第一次加载
        fn.apply(this, args)
        return firstTime = false
      }
  
      if (timer) {
        // 定时器正在执行中，跳过
        return
      }
  
      timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
        fn.apply(this, args)
      }, interval)
  
    }
  }


  function isElementInViewport (el) {
    const { top, height, left, width } = el.getBoundingClientRect()
    const w = window.innerWidth || document.documentElement.clientWidth
    const h = window.innerHeight || document.documentElement.clientHeight
    return (
      top <= h &&
      (top + height) >= 0 &&
      left <= w &&
      (left + width) >= 0
    )
  }
  
  

  LazyLoad(".lazy",{})



