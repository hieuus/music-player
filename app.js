const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const audio = $('#audio')
const playlistList = $('.playlist__list')
const cd = $('.cd__img')
const songName = $('.song__name')
const songAuthor = $('.song__author')
const songDuration = $('.progress-time__duration')
const songCurrentTime = $('.progress-time__current-time')
const showPlaylistIcon = $('.list-music__icon')
const closePlaylistIcon = $('.close-list')
const playlist = $('.playlist__container')
const playlistInner = $('.playlist')
const playBtn = $('.btn__play')
const prevBtn = $('.btn__previous')
const nextBtn = $('.btn__next')
const randomBtn = $('.btn__random')
const repeatBtn = $('.btn__repeat')
const progressBar = $('.progress-bar')
const progress = $('.progress-bar__value')
const volumeBtn = $('.volume')
const volumeBar = $('.volume-bar')
const volume = $('.volume-bar__value')
const heartIcon = $('.favourite')

const songPlayedList = new Set()

const app = {
    currentIndex: 0,
    currentVolume: 1,
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    isMute: false,
    isHoldProgressBar: false,
    isHoldVolumeBar: false,
    isFavourite: false,
    songs: [
        {
            name: "Perfect",
            singer: "ED Sheeran",
            path: "./assets/music/song5.mp3",
            image: "./assets/img/song5.jpg"
        },
        {
            name: "Shape Of You",
            singer: "ED Sheeran",
            path: "./assets/music/song6.mp3",
            image: "./assets/img/song6.jpg"
        },
        {
            name: "We Don't Talk Anymore",
            singer: "Charlie Puth, Selena Gomez",
            path: "./assets/music/song7.mp3",
            image: "./assets/img/song7.jpg"
        },
        {
            name: "Lily",
            singer: "Alan Walker",
            path: "./assets/music/song8.mp3",
            image: "./assets/img/song8.jpg"
        },
        {
            name: "No Promise",
            singer: "Shayne Ward",
            path: "./assets/music/song9.mp3",
            image: "./assets/img/song9.jpg"
        },
        {
            name: "My Love",
            singer: "Westlife",
            path: "./assets/music/song10.mp3",
            image: "./assets/img/song10.jpg"
        },
        {
            name: "Ngôi sao cô đơn",
            singer: "Jack",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/song1.jpg"
        },
        {
            name: "Hai mươi hai",
            singer: "Amee",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/song2.jpg"
        },
        {
            name: "Ta cứ đi cùng nhau",
            singer: "Đen Vâu",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/song3.jpg"
        },
        {
            name: "Mặt trời của em",
            singer: "Phương Ly",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.jpg"
        },
        {
            name: "happier",
            singer: "Olivia Rodrigo",
            path: "./assets/music/song11.mp3",
            image: "./assets/img/song11.jpg"
        },
        {
            name: "drivers license",
            singer: "Olivia Rodrigo",
            path: "./assets/music/song12.mp3",
            image: "./assets/img/song12.png"
        },
        {
            name: "deja vu",
            singer: "Olivia Rodrigo",
            path: "./assets/music/song13.mp3",
            image: "./assets/img/song13.jpg"
        },
        {
            name: "traitor",
            singer: "Olivia Rodrigo",
            path: "./assets/music/song14.mp3",
            image: "./assets/img/song14.jpg"
        },
    ],


    renderSong(){
        const htmls = this.songs.map((song, index) => {
            return `
            <li class="playlist__item" data-index="${index}">
                <div class="playlist__item-img">
                    <img src="${song.image}" alt="">
                </div>
                <div class="playlist__item-info">
                    <h3 class="playlist__item-name">${song.name}</h3>
                    <p class="playlist__item-author">${song.singer}</p>
                </div>
                <div class="music-waves">  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                    <span></span>  
                    <span></span>
                </div>
                <span class="playlist__item-option">
                    <i class="fa-solid fa-ellipsis"></i>
                </span>
            </li>
            `
        })
        playlistList.innerHTML = htmls.join('')
    },


    activeSong(){
        const songs = $$('.playlist__item')
        const musicWaves = $$('.music-waves')
        songs.forEach((song, index) => {
            if(index === this.currentIndex){
                song.classList.add('active')
                musicWaves[index].classList.add('active')
                song.scrollIntoView(
                    {
                        behavior: "smooth",
                        block: "center",
                        inline: "center"
                    }
                )
            } else {
                song.classList.remove('active')
                musicWaves[index].classList.remove('active')
            }
        })
    },


    defineProperties(){
        Object.defineProperty(this, 'currenSong', {
            get: () => this.songs[this.currentIndex]
        })
    },

    timeFormat(seconds){
        const date = new Date(null)
        date.setSeconds(seconds)
        return date.toISOString().slice(14, 19)
    },

    togglePlaylist(){
        playlist.classList.toggle('list-open')
    },

    loadCurrentSong(){
        const _this = this
        songName.textContent = this.currenSong.name
        songAuthor.textContent = this.currenSong.author
        cd.src = this.currenSong.image
        audio.src = this.currenSong.path
        progress.style.width = 0


        // Xử lý lấy tiến trình và thời lượng bài hát trước khi phát
        audio.onloadedmetadata = function(){
            songCurrentTime.textContent = _this.timeFormat(this.currentTime.toFixed(2))
            songDuration.textContent = _this.timeFormat(this.duration.toFixed(2))
        }
    },

    prevSong(){
        this.currentIndex--
        if(this.currentIndex<0) this.currentIndex = this.songs.length-1
        this.loadCurrentSong()
        this.activeSong()
    },

    nextSong(){
        this.currentIndex++
        if(this.currentIndex>this.songs.length-1) this.currentIndex = 0
        this.loadCurrentSong()
        this.activeSong()
    },

    // Xử lý random song nhưng sẽ hết tất cả các bài
    randomSong(){
        let random
        do {
            random = Math.floor(Math.random() * this.songs.length)
        } while (songPlayedList.has(random))
        this.currentIndex = random
        this.loadCurrentSong()
        songPlayedList.add(random)
        if(songPlayedList.size === this.songs.length){
            songPlayedList.clear()
        }
        this.activeSong()
    },

    repeatSong(){
        this.loadCurrentSong()
        this.activeSong()
    },

    handleEvents(){
        const _this = this
        _this.activeSong()

        // Xử lý quay CD khi play / pause nhạc
        const cdRotate = cd.animate({
            transform: ['rotate(0)', 'rotate(360deg)']
        },
        {
            duration: 7500,
            iterations: Infinity
        })
        cdRotate.pause()


        // Xử lý Play / Pause khi click
        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = function() {
            playBtn.classList.add('playing')
            cdRotate.play()
            _this.isPlaying = true
        }
        audio.onpause = function() {
            playBtn.classList.remove('playing')
            cdRotate.pause()
            _this.isPlaying = false
        } 


        // Xử lý thời current time và thanh tiến trình 
        audio.ontimeupdate = function() {
            songCurrentTime.textContent = _this.timeFormat(this.currentTime)
            const progressPercent = this.currentTime / this.duration * 100
            progress.style.width = progressPercent + '%'
        }


        // Xử lý Next / Previous Song
        prevBtn.onclick = function() {
            if(_this.isRepeat){
                _this.repeatSong()
            } else {
                if(_this.isRandom){
                    _this.randomSong()
                } else {
                    _this.prevSong()
                }
            }
            cdRotate.cancel()
            if(_this.isPlaying){
                audio.play()
            }
        }
        nextBtn.onclick = function() {
            if(_this.isRepeat){
                _this.repeatSong()
            } else {
                if(_this.isRandom){
                    _this.randomSong()
                } else {
                    _this.nextSong()
                }
            }
            cdRotate.cancel()
            if(_this.isPlaying){
                audio.play()
            }
        }


        // Xử lý next bài, random bài hoặc phát lại khi hết bài
        // Khi lặp thì không phát ngẫu nhiên
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            this.classList.toggle('active', _this.isRepeat)
        }
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            this.classList.toggle('active', _this.isRandom)
        }
        audio.onended = function() {
            if(!_this.isRepeat){
                if(_this.isRandom){
                    _this.randomSong()
                    cdRotate.cancel()
                } else {
                    _this.nextSong()
                    cdRotate.cancel()
                }
                audio.play()
            } else {
                _this.repeatSong()
                audio.play()
            }
        }


        // Xử lý show / hide Playlist
        showPlaylistIcon.onclick = function() {
            _this.togglePlaylist()
        }
        closePlaylistIcon.onclick = function() {
            _this.togglePlaylist()
        }
        playlist.onclick = function() {
            _this.togglePlaylist()
        }
        playlistInner.onclick = function(){
            event.stopPropagation()
        }


        // Xử lý Playlist
        // Xử lý play song khi click trong Playlist
        const songs = $$('.playlist__item')
        songs.forEach((song, index) => {
            const option = song.querySelector('.playlist__item-option')
            option.onclick = function() {
                event.stopPropagation()
            }
            song.onclick = function(e) {
                if(e.target != option && _this.currentIndex != index) {
                    _this.currentIndex = index
                    _this.loadCurrentSong()
                    _this.activeSong()
                    audio.play()
                }
            }
        })


        // Xử lý volume
        volumeBtn.onclick = function() {
            _this.isMute = !_this.isMute
            this.classList.toggle('active', _this.isMute)
            if(_this.isMute)
                audio.volume = 0
            else 
                audio.volume = _this.currentVolume
        }


        // Xử lý Favourite List
        heartIcon.onclick = function() {
            _this.isFavourite = !_this.isFavourite
            this.classList.toggle('active')
            const tooltip = this.querySelector('span')
            if(_this.isFavourite){
                tooltip.textContent = 'Remove Favourite'
                tooltip.style.bottom = '80%'
            } else {
                tooltip.textContent = 'Add Favourite'
                tooltip.style.bottom = '70%'
            }
        }


        // Xử lý MOUSE EVENT
        // Xử lý Seek, tua nhạc và thanh tiến trình
        progressBar.onmousedown = function(e) {
            audio.currentTime = e.offsetX / this.offsetWidth * audio.duration
            // Đặt cái này để làm được vừa giữ vừa kéo
            _this.isHoldProgressBar = true
        }
        progressBar.onmousemove = function(e) {
            if(_this.isHoldProgressBar){
                audio.currentTime = e.offsetX / this.offsetWidth * audio.duration
            }
        }
        // Xử lý thanh volume
        volumeBar.onmousedown = function(e) {
            if(e.offsetX >= 0 && e.offsetX <= this.offsetWidth){
                _this.currentVolume = (e.offsetX / this.offsetWidth).toFixed(2)
                audio.volume = _this.currentVolume
                volume.style.width = audio.volume * 100 + '%'
                if(audio.volume === 0)  _this.isMute = true
                else _this.isMute = false
                _this.isHoldVolumeBar = true
            }
        }
        volumeBar.onmousemove = function(e) {
            if(_this.isHoldVolumeBar){
                if(e.offsetX >= 0 && e.offsetX <= this.offsetWidth){
                    _this.currentVolume = (e.offsetX / this.offsetWidth).toFixed(2)
                    audio.volume = _this.currentVolume
                    volume.style.width = audio.volume * 100 + '%'
                    if(audio.volume === 0)  _this.isMute = true
                    else _this.isMute = false
                }
            }
        }
        audio.onvolumechange = function() {
            if(_this.isMute){
                volumeBtn.classList.add('active')
                volume.style.width = 0
            }
            else {
                volumeBtn.classList.remove('active')
                volume.style.width = this.volume * 100 + '%'
            }
        }
        window.onmouseup = function() {
            _this.isHoldProgressBar = false
            _this.isHoldVolumeBar = false
        }


        // Xử lý Keyboard Events
        // Ấn space để Play / Pause Music
        document.onkeyup = function(e) {
            if(e.which === 32){
                playBtn.click()
            }
        }
    },


    start(){
        // Định nghĩa các thuộc tính
        this.defineProperties()

        // Xử lý render bài hát ra Playlist
        this.renderSong()

        // Tải bài hát hiện tại vào UI để sẵn sàng phát nhạc
        this.loadCurrentSong()

        // Lắng nghe, xử lý các sự kiện (DOM Events)
        this.handleEvents()
    }
}
app.start()