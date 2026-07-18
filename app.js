(function(){
  function init(){
  const qs = id => document.getElementById(id);

  const bgMusic = qs('bgMusic');
  const tracks = [
    { src: 'Irony.mp3', name: 'Irony' },
    { src: 'Reunion.mp3', name: 'Reunion' }
  ];
  let currentTrack = Math.random() < 0.5 ? 0 : 1;
  function setTrack(idx) {
    currentTrack = idx;
    bgMusic.src = tracks[idx].src;
    bgMusic.load();
  }
  setTrack(currentTrack);
  // When song ends, play the other
  bgMusic.addEventListener('ended', () => {
    setTrack(currentTrack === 0 ? 1 : 0);
    bgMusic.play();
  });
  const musicToggle = qs('musicToggle');
  const volumeSlider = qs('volumeSlider');
  const splashScreen = qs('splashScreen');

  if (!bgMusic || !musicToggle || !volumeSlider) return;
  
  bgMusic.volume = 0.05;
  volumeSlider.value = 5;
  bgMusic.currentTime = 0;
  musicToggle.classList.add('paused');
  musicToggle.classList.remove('playing');
  setIcons(false);

  function setIcons(playing){
    const playEl = document.querySelector('.icon-play');
    const pauseEl = document.querySelector('.icon-pause');
    if (playEl) playEl.style.display = playing ? 'none' : 'block';
    if (pauseEl) pauseEl.style.display = playing ? 'block' : 'none';
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.classList.add('playing');
      musicToggle.classList.remove('paused');
      setIcons(true);
    } else {
      bgMusic.pause();
      musicToggle.classList.add('paused');
      musicToggle.classList.remove('playing');
      setIcons(false);
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    bgMusic.volume = volume;
  });

  if (splashScreen) {
    splashScreen.addEventListener('click', () => {
      splashScreen.style.opacity = '0';
      splashScreen.style.pointerEvents = 'none';
      bgMusic.play().catch(() => {});
      musicToggle.classList.add('playing');
      musicToggle.classList.remove('paused');
      setIcons(true);
    });
  }

  // Profile data
  const defaults = {
    username: 'Rednd',
    tagline: '"i like looking at feminine boys and small penis"',
    about: 'hey what\'s up, im rednd and i like playing games and watching anime. if you couldn\'t tell from my links, i also really like ratfucking. im also a big fan of kirino from oreimo. feel free to reach out to me on any of my socials',
    x: 'https://x.com/RedndRatfucking',
    youtube: 'https://www.youtube.com/@RedndRFC',
    steam: 'https://steamcommunity.com/id/Rednd/',
    myanimelist: 'https://myanimelist.net/profile/Rednd',
    site1: 'https://ratfucking.net',
    site2: 'https://nazrin.sh'
  };

  function applyProfile(profile) {
    qs('username').textContent = profile.username;
    qs('tagline').textContent = profile.tagline;
    qs('about').textContent = profile.about;
    qs('footerName').textContent = profile.username;
    const footerName2 = qs('footerName2');
    if (footerName2) footerName2.textContent = profile.username;
    
    qs('year').textContent = new Date().getFullYear();
    const year2 = qs('year2');
    if (year2) year2.textContent = new Date().getFullYear();

    qs('xLink').href = profile.x;
    qs('ytLink').href = profile.youtube;
    qs('steamLink').href = profile.steam;
    qs('maliLink').href = profile.myanimelist;
    qs('site1Link').href = profile.site1;
    qs('site2Link').href = profile.site2;
  }

  // Blog management
  async function fetchBlogs() {
    try {
      const res = await fetch('/api/blogs');
      if (!res.ok) throw new Error('Failed to fetch blogs');
      return await res.json();
    } catch (e) {
      return [];
    }
  }

  async function renderBlogs() {
    const blogList = qs('blogList');
    if (!blogList) return;
    blogList.replaceChildren();
    const loadingEl = document.createElement('p');
    loadingEl.className = 'no-blogs';
    loadingEl.textContent = 'Loading...';
    blogList.appendChild(loadingEl);
    const blogs = await fetchBlogs();
    blogList.replaceChildren();
    if (!blogs.length) {
      const emptyEl = document.createElement('p');
      emptyEl.className = 'no-blogs';
      emptyEl.textContent = 'No posts yet.';
      blogList.appendChild(emptyEl);
      return;
    }
    for (let i = blogs.length - 1; i >= 0; i--) {
      const blog = blogs[i];
      const blogEl = document.createElement('article');
      blogEl.className = 'blog-post';
      const titleEl = document.createElement('h2');
      titleEl.textContent = typeof blog.title === 'string' ? blog.title : '';

      const dateEl = document.createElement('p');
      dateEl.className = 'blog-date';
      const dateObj = new Date(blog.date);
      dateEl.textContent = Number.isNaN(dateObj.getTime())
        ? ''
        : dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const bodyEl = document.createElement('div');
      bodyEl.className = 'blog-body';
      bodyEl.textContent = typeof blog.content === 'string' ? blog.content : '';

      blogEl.appendChild(titleEl);
      blogEl.appendChild(dateEl);
      blogEl.appendChild(bodyEl);
      blogList.appendChild(blogEl);
    }
  }

  const blogModal = qs('blogModal');
  const newBlogBtn = qs('newBlogBtn');
  const publishBtn = qs('publishBtn');
  const closeBlogBtn = qs('closeBlogBtn');
  const blogTitle = qs('blogTitle');
  const blogContent = qs('blogContent');
  const blogPassword = qs('blogPassword');

  function resetBlogForm() {
    if (blogTitle) blogTitle.value = '';
    if (blogContent) blogContent.value = '';
    if (blogPassword) blogPassword.value = '';
  }

  if (newBlogBtn) {
    newBlogBtn.addEventListener('click', () => {
      blogModal.setAttribute('aria-hidden', 'false');
      blogTitle.focus();
    });
  }

  if (closeBlogBtn) {
    closeBlogBtn.addEventListener('click', () => {
      blogModal.setAttribute('aria-hidden', 'true');
      resetBlogForm();
    });
  }

  if (publishBtn) {
    publishBtn.addEventListener('click', async () => {
      const title = blogTitle.value.trim();
      const content = blogContent.value.trim();
      const password = blogPassword ? blogPassword.value : '';
      if (!title || !content || !password) {
        alert('Please fill in title, content, and password');
        return;
      }
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, password })
      });
      if (res.status === 401) {
        alert('Incorrect password.');
        return;
      }
      resetBlogForm();
      blogModal.setAttribute('aria-hidden', 'true');
      renderBlogs();
    });
  }

  // Modal close handlers
  if (blogModal) {
    blogModal.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        blogModal.setAttribute('aria-hidden', 'true');
        resetBlogForm();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogModal && blogModal.getAttribute('aria-hidden') === 'false') {
      blogModal.setAttribute('aria-hidden', 'true');
      resetBlogForm();
    }
  });

  // Page routing
  const homePage = qs('homePage');
  const blogPage = qs('blogPage');

  function showPage(page) {
    homePage.style.display = 'none';
    blogPage.style.display = 'none';
    const homeLinks = document.querySelectorAll('.nav-home');
    const blogLinks = document.querySelectorAll('.nav-blog');

    if (page === 'home') {
      homePage.style.display = 'block';
      homeLinks.forEach(link => link.classList.add('active'));
      blogLinks.forEach(link => link.classList.remove('active'));
    } else if (page === 'blog') {
      blogPage.style.display = 'block';
      blogLinks.forEach(link => link.classList.add('active'));
      homeLinks.forEach(link => link.classList.remove('active'));
      renderBlogs();
    }
  }

  function router() {
    const hash = window.location.hash || '#/';
    if (hash === '#/' || hash === '' || hash === '#') {
      showPage('home');
    } else if (hash === '#/blog') {
      showPage('blog');
    } else {
      showPage('home');
    }
  }

  document.querySelectorAll('.nav-home').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#/';
    });
  });

  document.querySelectorAll('.nav-blog').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.hash = '#/blog';
    });
  });

  window.addEventListener('hashchange', router);

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 40 - 20;
    const y = (e.clientY / window.innerHeight) * 40 - 20;
    document.body.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
  });

  applyProfile(defaults);
  router();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
