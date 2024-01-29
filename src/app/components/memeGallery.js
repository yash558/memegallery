"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';
import Image from 'next/image';

import 'photoswipe/dist/photoswipe.css'
import './MemeGallery.css'; // Create a separate CSS file for styling if needed

const MemeGallery = () => {
  const [memes, setMemes] = useState([]);
  const [after, setAfter] = useState(null);

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    const subreddit = 'memes';
    const limit = 12;

    try {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/top.json?limit=${limit}&after=${after}`
      );

      const newMemes = response.data.data.children.map((child) => ({
        id: child.data.id,
        title: child.data.title,
        thumbnail: child.data.thumbnail,
        url: child.data.url,
      }));

      setMemes([...memes, ...newMemes]);
      setAfter(response.data.data.after);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const openPhotoSwipe = (index) => {
    const items = memes.map((meme) => ({
      src: meme.url,
      w: 0,
      h: 0,
    }));

    const options = {
      index,
    };

    const gallery = new PhotoSwipe(
      document.querySelector('.pswp'),
      PhotoSwipeUI_Default,
      items,
      options
    );
    gallery.init();
  };

  const handleThumbnailClick = (index) => {
    openPhotoSwipe(index);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchMemes();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="meme-gallery-container">
      <Gallery>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {memes.map((meme, index) => (
            <Item key={meme.id} original={meme.url} thumbnail={meme.thumbnail}>
              {({ ref, open }) => (
                <div
                  ref={ref}
                  className="thumbnail cursor-pointer overflow-hidden rounded-md transition-transform transform hover:scale-105"
                  onClick={open}
                >
                  <img
                    src={meme.thumbnail}
                    alt={meme.title}
                    className="w-full h-auto rounded-md"
                    height={500}
                    width={500}
                  />
                </div>
              )}
            </Item>
          ))}
        </div>
      </Gallery>
      <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="pswp__bg"></div>
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
          </div>
          <div className="pswp__ui pswp__ui--hidden">
            <div className="pswp__top-bar">
              <div className="pswp__counter"></div>
              <button className="pswp__button pswp__button--close" title="Close"></button>
              <button className="pswp__button pswp__button--share" title="Share"></button>
              <button className="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
              <button className="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
              <div className="pswp__preloader">
                <div className="pswp__preloader__icn">
                  <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div className="pswp__share-tooltip"></div>
            </div>
            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
            <div className="pswp__caption">
              <div className="pswp__caption__center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGallery;
