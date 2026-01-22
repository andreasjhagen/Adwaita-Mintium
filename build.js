#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BUILD_DIR = 'build';
const THEMES = [
  {
    name: 'Adwaita-Mintium-GTK3',
    displayName: 'Mintium GTK3',
    comment: 'A modern GTK3 theme based on Adwaita',
    variant: 'light',
    gtkVersions: ['gtk-2.0', 'gtk-3.0'],
    sassFile: 'gtk-3.0/sass/gtk.scss',
    cssOutput: 'gtk-3.0/gtk.css',
    includeCinnamon: true,
    includeXfwm: true
  },
  {
    name: 'Adwaita-Mintium-GTK3-Dark',
    displayName: 'Mintium GTK3 Dark',
    comment: 'A modern dark GTK3 theme based on Adwaita',
    variant: 'dark',
    gtkVersions: ['gtk-2.0', 'gtk-3.0'],
    sassFile: 'gtk-3.0/sass/gtk-dark.scss',
    cssOutput: 'gtk-3.0/gtk.css',
    includeCinnamon: true,
    includeXfwm: true
  },
  {
    name: 'Adwaita-Mintium-GTK4',
    displayName: 'Mintium GTK4',
    comment: 'A modern GTK4 theme based on Adwaita with libadwaita support',
    variant: 'light',
    gtkVersions: ['gtk-4.0'],
    sassFile: 'gtk-4.0/sass/gtk.scss',
    cssOutput: 'gtk-4.0/gtk.css',
    includeCinnamon: false,
    includeXfwm: false
  },
  {
    name: 'Adwaita-Mintium-GTK4-Dark',
    displayName: 'Mintium GTK4 Dark',
    comment: 'A modern dark GTK4 theme based on Adwaita with libadwaita support',
    variant: 'dark',
    gtkVersions: ['gtk-4.0'],
    sassFile: 'gtk-4.0/sass/gtk-dark.scss',
    cssOutput: 'gtk-4.0/gtk.css',
    includeCinnamon: false,
    includeXfwm: false
  }
];

// Utility functions
function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  
  if (stat.isDirectory()) {
    createDirIfNotExists(dest);
    const entries = fs.readdirSync(src);
    
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function generateIndexTheme(theme) {
  return `[Desktop Entry]
Type=X-GNOME-Metatheme
Name=${theme.displayName}
Comment=${theme.comment}
Encoding=UTF-8

[X-GNOME-Metatheme]
GtkTheme=${theme.name}
MetacityTheme=Mint-Y
IconTheme=Tela
CursorTheme=Bibata-Modern-Classic
ButtonLayout=:minimize,maximize,close
`;
}

function buildTheme(theme) {
  console.log(`\n🎨 Building ${theme.name}...`);
  
  const themePath = path.join(BUILD_DIR, theme.name);
  
  // Clean and create theme directory
  if (fs.existsSync(themePath)) {
    fs.rmSync(themePath, { recursive: true, force: true });
  }
  createDirIfNotExists(themePath);
  
  // Compile SASS
  console.log(`  📝 Compiling SASS: ${theme.sassFile}`);
  try {
    execSync(`sass ${theme.sassFile} ${theme.cssOutput}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`  ❌ Failed to compile SASS for ${theme.name}`);
    throw error;
  }
  
  // Copy GTK directories
  for (const gtkDir of theme.gtkVersions) {
    console.log(`  📂 Copying ${gtkDir}`);
    const srcDir = path.join(gtkDir);
    const destDir = path.join(themePath, gtkDir);
    
    if (fs.existsSync(srcDir)) {
      copyRecursive(srcDir, destDir);
    }
  }
  
  // Copy Cinnamon theme if needed
  if (theme.includeCinnamon && fs.existsSync('cinnamon')) {
    console.log(`  📂 Copying cinnamon`);
    copyRecursive('cinnamon', path.join(themePath, 'cinnamon'));
  }
  
  // Copy XFWM4 theme if needed
  if (theme.includeXfwm && fs.existsSync('xfwm4')) {
    console.log(`  📂 Copying xfwm4`);
    copyRecursive('xfwm4', path.join(themePath, 'xfwm4'));
  }
  
  // Generate index.theme
  console.log(`  📝 Generating index.theme`);
  fs.writeFileSync(
    path.join(themePath, 'index.theme'),
    generateIndexTheme(theme)
  );
  
  // Copy LICENSE
  if (fs.existsSync('LICENSE.md')) {
    console.log(`  📄 Copying LICENSE.md`);
    fs.copyFileSync('LICENSE.md', path.join(themePath, 'LICENSE.md'));
  }
  
  console.log(`  ✅ ${theme.name} built successfully!`);
}

function cleanBuild() {
  console.log('\n🧹 Cleaning build directory...');
  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true, force: true });
  }
  createDirIfNotExists(BUILD_DIR);
  console.log('  ✅ Build directory cleaned!');
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    if (command === 'clean') {
      cleanBuild();
      return;
    }
    
    // Determine which themes to build
    let themesToBuild = THEMES;
    
    if (command === 'gtk3') {
      themesToBuild = THEMES.filter(t => t.name.includes('GTK3'));
    } else if (command === 'gtk3-light') {
      themesToBuild = THEMES.filter(t => t.name === 'Mintium-GTK3');
    } else if (command === 'gtk3-dark') {
      themesToBuild = THEMES.filter(t => t.name === 'Mintium-GTK3-Dark');
    } else if (command === 'gtk4') {
      themesToBuild = THEMES.filter(t => t.name.includes('GTK4'));
    } else if (command === 'gtk4-light') {
      themesToBuild = THEMES.filter(t => t.name === 'Mintium-GTK4');
    } else if (command === 'gtk4-dark') {
      themesToBuild = THEMES.filter(t => t.name === 'Mintium-GTK4-Dark');
    } else if (command === 'light') {
      themesToBuild = THEMES.filter(t => t.variant === 'light');
    } else if (command === 'dark') {
      themesToBuild = THEMES.filter(t => t.variant === 'dark');
    }
    
    console.log('🚀 Starting theme build process...');
    
    // Create build directory if it doesn't exist
    createDirIfNotExists(BUILD_DIR);
    
    // Build each theme
    for (const theme of themesToBuild) {
      buildTheme(theme);
    }
    
    console.log('\n✨ All themes built successfully!');
    console.log(`\n📦 Output location: ${path.resolve(BUILD_DIR)}/`);
    console.log('\n🎉 You can now copy the theme folders to ~/.themes/ or /usr/share/themes/');
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { buildTheme, cleanBuild, THEMES };
