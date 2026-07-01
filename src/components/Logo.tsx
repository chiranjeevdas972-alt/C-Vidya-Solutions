import { SVGProps } from "react";

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 120, showText = true, className = "", ...props }: LogoProps) {
  return (
    <svg
      viewBox="0 0 800 700"
      width={size}
      height={size}
      className={`select-none ${className}`}
      role="img"
      aria-label="C VIDYA SOLUTIONS Logo"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <title>C VIDYA SOLUTIONS Logo</title>
      <desc>Original vector graphic of C VIDYA SOLUTIONS featuring the modern geometric right-pointing blue arrow logo mark.</desc>
      
      <defs>
        {/* Core Vibrant Blue Gradients matching the original logo material */}
        <linearGradient id="chevron-blue-grad" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#2979FF" />
          <stop offset="30%" stopColor="#00E5FF" />
          <stop offset="65%" stopColor="#0072FF" />
          <stop offset="100%" stopColor="#0B214B" />
        </linearGradient>

        <linearGradient id="inner-bar-blue-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0072FF" />
          <stop offset="40%" stopColor="#00C6FF" />
          <stop offset="100%" stopColor="#031633" />
        </linearGradient>

        {/* Brand Deep Navy color for typography */}
        <linearGradient id="brand-navy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#061B3B" />
          <stop offset="100%" stopColor="#031127" />
        </linearGradient>

        {/* Subtle drop shadow for the logo mark */}
        <filter id="logo-drop-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* 1. MAIN GEOMETRIC ICON MARK */}
      <g filter="url(#logo-drop-shadow)" className="transition-transform duration-500 hover:scale-[1.02]">
        
        {/* Outer Chevron / Arrow Shape */}
        <path
          id="Chevron"
          d="M 315,90 
             L 580,280 
             L 345,450 
             L 380,395 
             L 485,280 
             L 318,160 
             Z"
          fill="url(#chevron-blue-grad)"
        />

        {/* Inner Parallel Blue Stripe Bar */}
        <path
          id="InnerBar"
          d="M 312,320 
             L 425,240 
             L 452,268 
             L 312,415 
             Z"
          fill="url(#inner-bar-blue-grad)"
        />

      </g>

      {/* 2. BRAND TYPOGRAPHY IN VECTOR PATHS */}
      {showText && (
        <g id="Typography">
          
          {/* "C VIDYA" Letterforms */}
          <g id="BrandName" fill="url(#brand-navy-grad)">
            {/* 'C' */}
            <path d="M 248,536 C 218,536 194,544 194,562 C 194,580 218,588 248,588 C 260,588 270,584 274,578 L 264,572 C 261,576 255,580 248,580 C 226,580 206,573 206,562 C 206,551 226,544 248,544 C 255,544 261,548 264,552 L 274,546 C 270,540 260,536 248,536 Z" />
            {/* 'V' */}
            <path d="M 290,538 L 300,538 L 317.5,572 L 335,538 L 345,538 L 322,586 L 313,586 Z" />
            {/* 'I' */}
            <path d="M 373,538 L 382,538 L 382,586 L 373,586 Z" />
            {/* 'D' */}
            <path d="M 410,538 L 438,538 C 450,538 459,546 459,562 C 459,578 450,586 438,586 L 410,586 Z M 420,546 L 420,578 L 436,578 C 445,578 449,572 449,562 C 449,552 445,546 436,546 Z" />
            {/* 'Y' */}
            <path d="M 480,538 L 490,538 L 503,556 L 503,586 L 512,586 L 512,556 L 525,538 L 535,538 L 513,550 L 502,550 Z" />
            {/* 'A' */}
            <path d="M 550,586 L 560,586 L 566,572 L 589,572 L 595,586 L 605,586 L 582,538 L 573,538 Z M 569,564 L 577.5,546 L 586,564 Z" />
          </g>

          {/* "— SOLUTIONS —" Subtext Letterforms with Accent Lines */}
          <g id="Subtext" fill="url(#brand-navy-grad)">
            {/* Left Decorative Dash */}
            <path d="M 180,624 L 215,624 L 215,626 L 180,626 Z" />

            {/* 'S' */}
            <path d="M 257,618 C 255,616 252,616 250,616 C 246,616 244,618 244,621 C 244,624 248,625 250,626 C 253,627 257,628 257,631 C 257,634 254,635 250,635 C 246,635 244,634 243,631 L 246,629 C 247,631 249,632 250,632 C 252,632 254,631 254,629 C 254,627 251,626 249,625 C 246,624 243,623 243,620 C 243,617 246,615 250,615 C 253,615 256,616 297,615 Z" style={{ display: "none" }} /> {/* Fallback hidden node for safety */}
            <path d="M 257,618 C 255,616 252,616 250,616 C 246,616 244,618 244,621 C 244,624 248,625 250,626 C 253,627 257,628 257,631 C 257,634 254,635 250,635 C 246,635 244,634 243,631 L 246,629 C 247,631 249,632 250,632 C 252,632 254,631 254,629 C 254,627 251,626 249,625 C 246,624 243,623 243,620 C 243,617 246,615 250,615 C 253,615 256,616 257,618 Z" />
            {/* 'O' */}
            <path d="M 280,615 C 285,615 288,619 288,625 C 288,631 285,635 280,635 C 275,635 272,631 272,625 C 272,619 275,615 280,615 Z M 280,618 C 277,618 275,621 275,625 C 275,629 277,632 280,632 C 283,632 285,629 285,625 C 285,621 283,618 280,618 Z" />
            {/* 'L' */}
            <path d="M 304,616 L 307,616 L 307,632 L 316,632 L 316,635 L 304,635 Z" />
            {/* 'U' */}
            <path d="M 333,616 L 336,616 L 336,631 C 336,633 338,634 340,634 C 342,634 344,633 344,631 L 344,616 L 347,616 L 347,631 C 347,634 344,636 340,636 C 336,636 333,634 333,631 Z" />
            {/* 'T' */}
            <path d="M 363,616 L 377,616 L 377,619 L 371,619 L 371,635 L 368,635 L 368,619 L 363,619 Z" />
            {/* 'I' */}
            <path d="M 398,616 L 402,616 L 402,635 L 398,635 Z" />
            {/* 'O' */}
            <path d="M 430,615 C 435,615 438,619 438,625 C 438,631 435,635 430,635 C 425,635 422,631 422,625 C 422,619 425,615 430,615 Z M 430,618 C 427,618 425,621 425,625 C 425,629 427,632 430,632 C 433,632 435,629 435,625 C 435,621 433,618 430,618 Z" />
            {/* 'N' */}
            <path d="M 453,616 L 456,616 L 464,631 L 464,616 L 467,616 L 467,635 L 464,635 L 456,620 L 456,635 L 453,635 Z" />
            {/* 'S' */}
            <path d="M 497,618 C 495,616 492,616 490,616 C 486,616 484,618 484,621 C 484,624 488,625 490,626 C 493,627 497,628 497,631 C 497,634 494,635 490,635 C 486,635 484,634 483,631 L 486,629 C 487,631 489,632 490,632 C 492,632 494,631 494,629 C 494,627 491,626 489,625 C 486,624 483,623 483,620 C 483,617 486,615 490,615 C 493,615 496,616 497,618 Z" />

            {/* Right Decorative Dash */}
            <path d="M 525,624 L 560,624 L 560,626 L 525,626 Z" />
          </g>

        </g>
      )}
    </svg>
  );
}
