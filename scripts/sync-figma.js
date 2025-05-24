// scripts/sync-figma.js
const fs = require('fs');
const path = require('path');

// Read Style Dictionary tokens
const colorTokens = JSON.parse(fs.readFileSync('tokens/colors/base.json', 'utf8'));
const semanticTokens = JSON.parse(fs.readFileSync('tokens/colors/semantic.json', 'utf8'));
const spacingTokens = JSON.parse(fs.readFileSync('tokens/spacing/base.json', 'utf8'));
const typographyTokens = JSON.parse(fs.readFileSync('tokens/typography/base.json', 'utf8'));
const borderTokens = JSON.parse(fs.readFileSync('tokens/border/base.json', 'utf8'));

// Convert to Figma format
function convertToFigmaFormat() {
  const figmaTokens = {
    global: {
      colors: {
        base: {},
        semantic: {}
      },
      spacing: {
        scale: {}
      },
      typography: {
        fontFamilies: {},
        fontWeights: {},
        fontSizes: {}
      },
      borderRadius: {}
    }
  };

  // Process colors
  if (colorTokens.color && colorTokens.color.base) {
    Object.keys(colorTokens.color.base).forEach(key => {
      if (typeof colorTokens.color.base[key].value === 'string') {
        figmaTokens.global.colors.base[key] = {
          value: colorTokens.color.base[key].value,
          type: 'color'
        };
      } else {
        // Handle nested objects like neutral colors
        figmaTokens.global.colors.base[key] = {};
        Object.keys(colorTokens.color.base[key]).forEach(subKey => {
          figmaTokens.global.colors.base[key][subKey] = {
            value: colorTokens.color.base[key][subKey].value,
            type: 'color'
          };
        });
      }
    });
  }

  // Process semantic colors
  if (semanticTokens.color && semanticTokens.color.semantic) {
    Object.keys(semanticTokens.color.semantic).forEach(key => {
      if (typeof semanticTokens.color.semantic[key].value === 'string') {
        figmaTokens.global.colors.semantic[key] = {
          value: semanticTokens.color.semantic[key].value,
          type: 'color'
        };
      } else {
        // Handle nested objects
        figmaTokens.global.colors.semantic[key] = {};
        Object.keys(semanticTokens.color.semantic[key]).forEach(subKey => {
          figmaTokens.global.colors.semantic[key][subKey] = {
            value: semanticTokens.color.semantic[key][subKey].value,
            type: 'color'
          };
        });
      }
    });
  }

  // Process spacing
  if (spacingTokens.spacing && spacingTokens.spacing.scale) {
    Object.keys(spacingTokens.spacing.scale).forEach(key => {
      figmaTokens.global.spacing.scale[key] = {
        value: spacingTokens.spacing.scale[key].value.replace('px', ''),
        type: 'spacing'
      };
    });
  }

  // Process typography
  if (typographyTokens.font) {
    if (typographyTokens.font.family) {
      Object.keys(typographyTokens.font.family).forEach(key => {
        figmaTokens.global.typography.fontFamilies[key] = {
          value: typographyTokens.font.family[key].value,
          type: 'fontFamilies'
        };
      });
    }

    if (typographyTokens.font.weight) {
      Object.keys(typographyTokens.font.weight).forEach(key => {
        figmaTokens.global.typography.fontWeights[key] = {
          value: typographyTokens.font.weight[key].value,
          type: 'fontWeights'
        };
      });
    }

    if (typographyTokens.font.size) {
      Object.keys(typographyTokens.font.size).forEach(key => {
        figmaTokens.global.typography.fontSizes[key] = {
          value: typographyTokens.font.size[key].value.replace('px', ''),
          type: 'fontSizes'
        };
      });
    }
  }

  // Process border radius
  if (borderTokens.border && borderTokens.border.radius) {
    Object.keys(borderTokens.border.radius).forEach(key => {
      figmaTokens.global.borderRadius[key] = {
        value: borderTokens.border.radius[key].value.replace('px', ''),
        type: 'borderRadius'
      };
    });
  }

  return figmaTokens;
}

// Generate Figma tokens
const figmaTokens = convertToFigmaFormat();

// Write to file
fs.writeFileSync('figma-tokens.json', JSON.stringify(figmaTokens, null, 2));

console.log('✅ Figma tokens updated successfully!');
console.log('📁 Import figma-tokens.json into the Figma Tokens plugin');