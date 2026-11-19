/**
 * =====================================================================
 * SARU FOR YOU 💗 - Configuration & Personalization File
 * =====================================================================
 *
 * Hello Rihan!
 * This is the central file where you can customize all text, messages,
 * photos, and secret words without having to dig through component code.
 *
 * When you have your six photos ready, simply place them into the folder:
 *   /public/images/
 * named:
 *   photo1.jpg  -> Sarena and Rihan together (Couple photo)
 *   photo2.jpg  -> Sarena alone
 *   photo3.jpg  -> Sarena alone
 *   photo4.jpg  -> Sarena alone
 *   photo5.jpg  -> Sarena alone
 *   photo6.jpg  -> Decorative background for the secret-word screen
 *
 * If you ever need to change the file names or format (e.g. .png),
 * simply update the photo paths below!
 */

export interface WebsiteConfig {
  /** The website name displayed in headers and browser title */
  websiteName: string;

  /** Name of the special recipient */
  recipientName: string;

  /** Nickname of the recipient */
  recipientNickname: string;

  /** Name of the creator */
  senderName: string;

  /**
   * Secret word required to unlock Screen 2.
   * Case-insensitive (e.g. "rose", "Rose", "ROSE" all match).
   * Default temporary word: "rose"
   */
  secretWord: string;

  /** Main tagline shown on the welcome screen */
  tagline: string;

  /** Subtitle message under the welcome screen title */
  welcomeMessage: string;

  /** Supporting welcoming statement */
  welcomeNote: string;

  /** Favourite flower motif */
  favouriteFlower: string;

  /** Secret screen heading and prompt */
  secretScreen: {
    heading: string;
    supportingText: string;
    inputPlaceholder: string;
    unlockButtonText: string;
    errorMessage: string;
    hintText: string;
  };

  /** Photo paths & captions */
  photos: {
    /**
     * Photo 1: Sarena and Rihan Together (The ONLY couple photo)
     * Used on the Our Story page and as the 3x3 sliding puzzle source.
     */
    couplePhoto: {
      src: string;
      fallbackSrc: string;
      title: string;
      caption: string;
      alt: string;
    };

    /**
     * Photo 6 / Second couple photo: Forehead kiss
     */
    couplePhoto2?: {
      src: string;
      fallbackSrc: string;
      title: string;
      caption: string;
      alt: string;
    };

    /**
     * Photos 2, 3, 4, 5, 7, 8: Sarena Alone
     * Displayed in the "A Little World of You" gallery.
     */
    sarenaGallery: Array<{
      id: number;
      src: string;
      fallbackSrc: string;
      caption: string;
      alt: string;
    }>;

    /**
     * Photo 6: Secret Code Screen decorative background
     */
    secretScreenPhoto: {
      src: string;
      fallbackSrc: string;
      alt: string;
    };
  };

  /** Story screen text */
  storyScreen: {
    heading: string;
    introText: string;
    galleryHeading: string;
    gallerySubtitle: string;
    nextButtonText: string;
  };

  /** Time Since We Met counter configuration */
  timeSinceWeMet: {
    enabled: boolean;
    startDate: string;
    displayDate: string;
    title: string;
    caption: string;
  };

  /** 3x3 Sliding Puzzle configuration */
  puzzleScreen: {
    heading: string;
    instructionText: string;
    successMessage: string;
    revealButtonText: string;
    restartButtonText: string;
    backButtonText: string;
  };

  /** Screen 5: The Final Surprise configuration */
  surpriseScreen: {
    heading: string;
    supportingText: string;

    /** 5 Personal editable message cards */
    personalMessages: Array<{
      id: number;
      quote: string;
      note?: string;
    }>;

    /** Envelope and heartfelt personal letter */
    envelope: {
      coverTitle: string;
      letterHeading: string;
      letterBody: string;
      letterSignoff: string;
    };

    /** Replay navigation buttons */
    replayButtons: {
      revisitStory: string;
      playPuzzleAgain: string;
      readLetterAgain: string;
    };
  };

  /** Birthday feature configuration */
  birthday: {
    /** Set to true to display the birthday section, false to hide it */
    enabled: boolean;
    /** The birthday date string */
    dateString: string;
    /** The formatted celebration date */
    displayDate: string;
    /** Warm birthday blessing */
    message: string;
  };

  /** Music feature configuration */
  music: {
    songTitle: string;
    artists: string;
    /** Optional YouTube / Spotify / Sound link to open on click */
    externalUrl: string;
    /** Direct audio file path in /public/audio/ */
    audioSrc: string;
    /** Original video file path in /public/assets/aistudio/ */
    videoSrc?: string;
    /** Automatically play after unlocking the secret password */
    autoPlayOnUnlock: boolean;
    /** Note displayed next to the music widget */
    caption: string;
  };
}

export const config: WebsiteConfig = {
  websiteName: "Saru for You",
  recipientName: "Sarena",
  recipientNickname: "Saru",
  senderName: "Rihan",

  // 🔑 SECRET WORD: Edit this to whatever secret code you and Sarena share!
  secretWord: "rose",

  tagline: "A little world made with love, just for you.",
  welcomeMessage: "Saru for You",
  welcomeNote:
    "Every picture holds a memory. Every little detail has a reason. And there's one last surprise waiting for you.",
  favouriteFlower: "Rose",

  secretScreen: {
    heading: "A Little Secret",
    supportingText: "Some little things are meant to be discovered by the right person.",
    inputPlaceholder: "Enter the secret word...",
    unlockButtonText: "Unlock My Surprise",
    errorMessage: "That is not quite it. Take your time, think of something special, and try again. 🌹",
    hintText: "Need a whisper? Think of a soft, timeless flower that blooms with love.",
  },

  photos: {
    // 📸 Photo 1: Main Couple Photo (Used in Our Story header frame & Photo Puzzle)
    couplePhoto: {
      src: "/images/photo1.jpg",
      fallbackSrc: "/images/photo1.svg",
      title: "Sarena & Rihan",
      caption: "One picture, two people, and a memory worth keeping forever.",
      alt: "Rihan and Sarena together smiling warmly in purple attire",
    },

    // 📸 Photo 6: Second Couple Photo (Forehead kiss, featured in Secret Gate backdrop & Keepsake Gallery)
    couplePhoto2: {
      src: "/images/photo6.jpg",
      fallbackSrc: "/images/photo6.svg",
      title: "Quiet Forehead Kiss",
      caption: "A soft, timeless promise held close to the heart.",
      alt: "Rihan gently kissing Sarena's forehead in black and white",
    },

    // 📸 Solo Photos of Sarena in "A Little World of You" gallery & swipeable slider
    sarenaGallery: [
      {
        id: 2,
        src: "/images/photo2.jpg",
        fallbackSrc: "/images/photo2.svg",
        caption: "A smile that brightens every quiet room.",
        alt: "Sarena in elegant pink traditional saree smiling radiantly",
      },
      {
        id: 3,
        src: "/images/photo3.jpg",
        fallbackSrc: "/images/photo3.svg",
        caption: "Some memories need no explanation, just a happy heart.",
        alt: "Sarena outdoors near traditional Assamese Japi smiling happily",
      },
      {
        id: 4,
        src: "/images/photo4.jpg",
        fallbackSrc: "/images/photo4.svg",
        caption: "A simple picture, a special feeling.",
        alt: "Sarena smiling softly in floral dress",
      },
      {
        id: 5,
        src: "/images/photo5.jpg",
        fallbackSrc: "/images/photo5.svg",
        caption: "A quiet moment to remember in the afternoon sun.",
        alt: "Sarena in white dress resting her cheek on her hand",
      },
      {
        id: 7,
        src: "/images/photo7.jpg",
        fallbackSrc: "/images/photo5.svg",
        caption: "Pure happiness caught in a quiet blink.",
        alt: "Sarena smiling peacefully with eyes closed in white dress",
      },
      {
        id: 8,
        src: "/images/photo8.jpg",
        fallbackSrc: "/images/photo2.svg",
        caption: "The playful expressions that make every day sweeter.",
        alt: "Sarena cute expressions collage in red gingham top",
      },
    ],

    // 📸 Secret Screen decorative background
    secretScreenPhoto: {
      src: "/images/photo6.jpg",
      fallbackSrc: "/images/photo6.svg",
      alt: "Rihan gently kissing Sarena's forehead in black and white",
    },
  },

  storyScreen: {
    heading: "Our Story",
    introText: "Sometimes a simple meeting can become a memory worth keeping.",
    galleryHeading: "A Little World of You",
    gallerySubtitle: "Six quiet frames dedicated entirely to your grace and charm.",
    nextButtonText: "Continue to The Photo Puzzle",
  },

  // 🗓️ TIME SINCE WE MET: Set to true if you ever want to re-enable this counter
  timeSinceWeMet: {
    enabled: false,
    startDate: "2024-04-14",
    displayDate: "14 April 2024",
    title: "Time Since We Met",
    caption: "Every single day since our first conversation has become a memory worth keeping.",
  },

  puzzleScreen: {
    heading: "A Memory to Reassemble",
    instructionText:
      "Slide the pieces into place to reveal our complete picture. Tap or click any tile adjacent to the empty spot to move it.",
    successMessage: "You found the picture. Now there's one more little surprise waiting for you. 💗",
    revealButtonText: "Reveal the Surprise",
    restartButtonText: "Restart Puzzle",
    backButtonText: "Back to Our Story",
  },

  surpriseScreen: {
    heading: "One Last Thing, Saru…",
    supportingText: "I saved one more little thing for you.",

    personalMessages: [
      {
        id: 1,
        quote: "Some moments become special without even trying.",
        note: "01",
      },
      {
        id: 2,
        quote: "A little memory can bring back a big smile.",
        note: "02",
      },
      {
        id: 3,
        quote: "Some pictures say more than words can.",
        note: "03",
      },
      {
        id: 4,
        quote: "The smallest moments can become the most memorable.",
        note: "04",
      },
      {
        id: 5,
        quote: "This little surprise was made with care, just for you.",
        note: "05",
      },
    ],

    envelope: {
      coverTitle: "A Birthday Letter for You",
      letterHeading: "Dearest Saru,",
      letterBody:
        "Happy, Happy Birthday to the most special person in my world. 🎂✨\n\n" +
        "As you celebrate another beautiful year of your life today, I wanted to step away from everything else to write down what my heart has always felt. Sometimes ordinary words fall short of capturing just how much you truly mean to me, but every single thought here comes straight from the deepest corner of my heart.\n\n" +
        "From the very first day we connected to every laugh and late-night conversation we've shared across the miles, you have brought an effortless warmth into my life that nothing else could ever replace. Your gentle smile, your playful expressions, the way your voice sounds when you are truly happy—those are the quiet treasures that brighten my world even on the most ordinary days.\n\n" +
        "On this birthday, my deepest prayer and wish for you is that this new chapter brings you endless reasons to smile, peaceful days filled with warmth, and dreams that quietly turn into reality. May you always be surrounded by boundless love, good health, and the kind of happiness that makes your eyes crinkle. You deserve the entire world and every sweet blessing waiting in it.\n\n" +
        "No matter where time takes us, know that you will always hold an irreplaceable, cherished place in my heart. Today belongs entirely to celebrating you—your pure kindness, your graceful spirit, and the wonderful person you are.\n\n" +
        "Thank you for being you, Saru. May your birthday be as beautiful, radiant, and sweet as you are. 🌸",
      letterSignoff: "Forever with love,\nRihan 💗",
    },

    replayButtons: {
      revisitStory: "Revisit Our Story",
      playPuzzleAgain: "Play the Puzzle Again",
      readLetterAgain: "Read the Letter Again",
    },
  },

  birthday: {
    enabled: true,
    dateString: "2026-11-20",
    displayDate: "20 November 2026",
    message: "Wishing you a day filled with smiles, beautiful memories and little reasons to be happy.",
  },

  music: {
    songTitle: "Alfaaz",
    artists: "Hamza Malik & Zain Zohaib",
    audioSrc: "/audio/alfaaz.mp3",
    videoSrc: "/assets/aistudio/my_video_3be5f4eb.mp4",
    externalUrl: "https://www.youtube.com/results?search_query=Alfaaz+Hamza+Malik+Zain+Zohaib",
    autoPlayOnUnlock: true,
    caption: "A song with a special place in our world.",
  },
};
