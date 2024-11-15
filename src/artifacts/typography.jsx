import React from 'react';

const TypographyAndColors = () => {
  // Define complete class combinations
  const colorVariants = {
    slate: {
      50: 'h-16 rounded bg-slate-50',
      200: 'h-16 rounded bg-slate-200',
      400: 'h-16 rounded bg-slate-400',
      600: 'h-16 rounded bg-slate-600',
      800: 'h-16 rounded bg-slate-800'
    },
    blue: {
      50: 'h-16 rounded bg-blue-50',
      200: 'h-16 rounded bg-blue-200',
      400: 'h-16 rounded bg-blue-400',
      600: 'h-16 rounded bg-blue-600',
      800: 'h-16 rounded bg-blue-800'
    },
    green: {
      50: 'h-16 rounded bg-green-50',
      200: 'h-16 rounded bg-green-200',
      400: 'h-16 rounded bg-green-400',
      600: 'h-16 rounded bg-green-600',
      800: 'h-16 rounded bg-green-800'
    }
  };

  const ColorSection = ({ color, title }) => (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(colorVariants[color]).map(([shade, classes]) => (
          <div key={shade} className="space-y-1">
            <div className={classes}></div>
            <p className="text-sm text-slate-600">{color}-{shade}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Typography Section */}
      <section className="space-y-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Typography Showcase</h1>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">Heading 1 (text-5xl)</h1>
          <h2 className="text-4xl font-semibold">Heading 2 (text-4xl)</h2>
          <h3 className="text-3xl font-medium">Heading 3 (text-3xl)</h3>
          <h4 className="text-2xl">Heading 4 (text-2xl)</h4>
          <h5 className="text-xl">Heading 5 (text-xl)</h5>
          <h6 className="text-lg">Heading 6 (text-lg)</h6>
        </div>

        <div className="space-y-4">
          <p className="text-base">
            Base text (text-base): The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm">
            Small text (text-sm): The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-xs">
            Extra small text (text-xs): The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-base font-light">
            Light text: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-base font-normal">
            Normal text: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-base font-medium">
            Medium text: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-base font-semibold">
            Semibold text: The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-base font-bold">
            Bold text: The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </section>

      {/* Colors Section */}
      <section className="space-y-8">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Color Palette</h2>
        
        <div className="space-y-6">
          <ColorSection color="slate" title="Slate" />
          <ColorSection color="blue" title="Blue" />
          <ColorSection color="green" title="Green" />
        </div>
      </section>

      {/* Text Colors */}
      <section className="space-y-4">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Text Colors</h2>
        <p className="text-slate-900">Text Slate 900</p>
        <p className="text-blue-600">Text Blue 600</p>
        <p className="text-green-600">Text Green 600</p>
        <p className="text-red-600">Text Red 600</p>
        <p className="text-purple-600">Text Purple 600</p>
      </section>
    </div>
  );
};

export default TypographyAndColors;