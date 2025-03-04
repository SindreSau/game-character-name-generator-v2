const BackgroundAbstractSvg = () => {
  return (
    <div className="fixed -z-10 object-fill">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        className="w-full h-full"
      >
        {/* Dark background */}
        <rect width="1200" height="800" fill="#050505" />

        {/* Define enhanced gradients for each shape */}
        <defs>
          {/* Left side multi-stop gradient */}
          <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1F351F" />
            <stop offset="40%" stopColor="#1B2F1B" />
            <stop offset="70%" stopColor="#192A19" />
            <stop offset="100%" stopColor="#162616" />
          </linearGradient>

          {/* Middle complex gradient */}
          <linearGradient
            id="middleGradient"
            x1="20%"
            y1="10%"
            x2="80%"
            y2="90%"
          >
            <stop offset="0%" stopColor="#152315" />
            <stop offset="30%" stopColor="#121F12" />
            <stop offset="60%" stopColor="#101C10" />
            <stop offset="100%" stopColor="#0E190E" />
          </linearGradient>

          {/* Right top gradient with multiple stops */}
          <linearGradient
            id="rightTopGradient"
            x1="10%"
            y1="10%"
            x2="90%"
            y2="90%"
          >
            <stop offset="0%" stopColor="#253B25" />
            <stop offset="35%" stopColor="#213721" />
            <stop offset="70%" stopColor="#1D321D" />
            <stop offset="100%" stopColor="#1A2D1A" />
          </linearGradient>

          {/* Bottom right complex gradient */}
          <linearGradient
            id="bottomRightGradient"
            x1="30%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#101010" />
            <stop offset="40%" stopColor="#0D0D0D" />
            <stop offset="80%" stopColor="#0A0A0A" />
            <stop offset="100%" stopColor="#080808" />
          </linearGradient>

          {/* Additional shape gradient 1 */}
          <linearGradient
            id="additionalGradient1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#172717" />
            <stop offset="50%" stopColor="#142414" />
            <stop offset="100%" stopColor="#122112" />
          </linearGradient>

          {/* Additional shape gradient 2 */}
          <linearGradient
            id="additionalGradient2"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#0B120B" />
            <stop offset="50%" stopColor="#0D150D" />
            <stop offset="100%" stopColor="#0F180F" />
          </linearGradient>

          {/* Subtle accent gradient with multiple stops */}
          <linearGradient
            id="accentGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00FF00" stopOpacity="0.01" />
            <stop offset="50%" stopColor="#00FF00" stopOpacity="0.025" />
            <stop offset="100%" stopColor="#00FF00" stopOpacity="0.02" />
          </linearGradient>

          {/* Secondary accent gradient with multiple stops */}
          <linearGradient
            id="accentGradient2"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#00FF00" stopOpacity="0.015" />
            <stop offset="50%" stopColor="#00FF00" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#00FF00" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Large angular shapes with enhanced gradients */}
        <g>
          {/* Left angular shape */}
          <polygon points="0,0 500,0 300,800 0,600" fill="url(#leftGradient)" />

          {/* Middle angular shape */}
          <polygon
            points="400,0 900,0 1200,500 700,800 300,800"
            fill="url(#middleGradient)"
          />

          {/* Top right angular shape */}
          <polygon
            points="900,0 1200,0 1200,500"
            fill="url(#rightTopGradient)"
          />

          {/* Bottom right angular shape */}
          <polygon
            points="500,800 1200,800 1200,500 700,300"
            fill="url(#bottomRightGradient)"
          />

          {/* Additional angular shape 1 */}
          <polygon
            points="400,150 700,50 800,400"
            fill="url(#additionalGradient1)"
            opacity="0.5"
          />

          {/* Additional angular shape 2 */}
          <polygon
            points="600,500 900,600 750,800"
            fill="url(#additionalGradient2)"
            opacity="0.4"
          />
        </g>

        {/* Subtle accent elements */}
        <polygon
          points="700,300 1200,500 700,800"
          fill="url(#accentGradient)"
        />
        <polygon points="400,0 600,200 300,300" fill="url(#accentGradient2)" />

        {/* Subtle overlay to blend everything */}
        <rect width="1200" height="800" fill="#000000" opacity="0.08" />
      </svg>
    </div>
  );
};

export default BackgroundAbstractSvg;
