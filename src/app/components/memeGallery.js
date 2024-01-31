"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'photoswipe/dist/photoswipe.css';
import { Gallery, Item } from 'react-photoswipe-gallery';

import 'photoswipe/dist/photoswipe.css'
import './MemeGallery.css'; 

const MemeGallery = () => {
  const [memes, setMemes] = useState([]);
  const [after, setAfter] = useState(null);

  useEffect(() => {
    fetchMemes();
  }, []);

  let limit = 12;
  const fetchMemes = async () => {
    const subreddit = 'memes';
    limit += 4;

    try {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/top.json?limit=${limit}`
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



  const handleScroll = () => {
    const scrollThreshold = 100;
  
    const scrolledToBottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - scrollThreshold;
  
    if (scrolledToBottom) {
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
    </div>
  );
};

export default MemeGallery;