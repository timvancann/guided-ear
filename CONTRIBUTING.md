# Contributing to Guided Ear Training

Thank you for your interest in contributing to Guided Ear Training! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Python 3+ or Homebrew (for pre-commit)
- Git

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/guided-ear.git
   cd guided-ear
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up pre-commit hooks**

   ```bash
   # Install pre-commit
   pip install pre-commit
   # or
   brew install pre-commit

   # Install the git hooks
   pnpm pre-commit:install
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

## 🛠️ Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Making Changes

1. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**

   - Follow the existing code style
   - Use Svelte 5 runes (`$state`, `$derived`, `$effect`)
   - Add TypeScript types
   - Maintain responsive design

3. **Test your changes**

   ```bash
   # Run type checking
   pnpm check

   # Run linting
   pnpm lint

   # Build the project
   pnpm build
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   Pre-commit hooks will automatically run and check:

   - Code formatting (Prettier)
   - Linting (ESLint)
   - TypeScript types
   - File integrity

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:

```
feat: add interval training statistics
fix: resolve audio playback timing issue
docs: update README with new features
```

## 🔍 Code Quality Standards

### Pre-commit Hooks

Our pre-commit hooks ensure code quality by automatically checking:

- ✅ Trailing whitespace removal
- ✅ End-of-file fixes
- ✅ YAML/JSON validation
- ✅ Merge conflict detection
- ✅ Large file prevention
- ✅ Private key detection
- ✅ Prettier formatting
- ✅ ESLint with auto-fix
- ✅ TypeScript type checking
- ✅ Build validation (on push)

Run manually:

```bash
pnpm pre-commit:run
```

### CI/CD Pipeline

All pull requests must pass:

- **Linting** - ESLint and Prettier checks
- **Type Checking** - TypeScript validation
- **Building** - Successful production build
- **Node Compatibility** - Tests on Node.js 20.x and 22.x

## 📁 Project Structure

```
src/
├── lib/
│   ├── training/          # Training system core
│   ├── chordflow/         # ChordFlow practice system
│   ├── components/        # Reusable UI components
│   ├── services/          # External service integrations
│   └── storage.svelte.ts  # localStorage utilities
└── routes/               # SvelteKit pages
    ├── handsfree/        # Voice-guided training
    ├── interactive/      # Click-based training
    └── chordflow/        # Chord progression practice
```

## 🎨 Coding Guidelines

### TypeScript

- Use proper type annotations
- Avoid `any` types
- Define interfaces for complex objects
- Use enums for constants

### Svelte 5

- Use runes for reactivity (`$state`, `$derived`, `$effect`)
- Keep components focused and reusable
- Use proper component lifecycle
- Implement proper cleanup in `$effect`

### Styling

- Use Tailwind CSS utilities
- Follow existing color scheme (dark theme)
- Maintain responsive design
- Use CSS-in-JS sparingly

### Audio System

- Use the global `audioState` for WebAudioFont
- Implement proper audio cleanup
- Handle audio context suspension/resumption
- Test across different browsers

## 🧪 Testing Guidelines

### Manual Testing

Before submitting a PR, test:

- [ ] All training modes work correctly
- [ ] Audio playback is synchronized
- [ ] Settings persist across sessions
- [ ] Responsive design on mobile/tablet
- [ ] Keyboard shortcuts function
- [ ] No console errors

### Browser Compatibility

Test on:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📝 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props with TypeScript
- Include usage examples for utilities
- Update README.md for new features

### User Documentation

- Update feature descriptions
- Add screenshots for UI changes
- Document new keyboard shortcuts
- Include migration guides if needed

## 🎯 Adding New Features

### New Training Mode

1. Create mode definition in `src/lib/training/modes/`
2. Implement the `TrainingMode` interface
3. Add routes in `src/routes/handsfree/` and `src/routes/interactive/`
4. Create mode-specific settings component
5. Update navigation

### New UI Component

1. Create in `src/lib/components/`
2. Use TypeScript for props
3. Follow existing patterns
4. Add to relevant pages

## 🐛 Reporting Issues

### Bug Reports

Include:

- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Console errors
- Screenshots if applicable

### Feature Requests

Describe:

- Use case
- Proposed solution
- Alternative solutions
- Additional context

## 📤 Submitting Pull Requests

1. **Ensure all checks pass**

   ```bash
   pnpm lint
   pnpm check
   pnpm build
   ```

2. **Update documentation**

   - README.md for new features
   - Code comments
   - This CONTRIBUTING.md if needed

3. **Create pull request**

   - Reference any related issues
   - Provide clear description
   - Include screenshots for UI changes
   - List breaking changes

4. **Address review feedback**
   - Make requested changes
   - Push updates to the same branch
   - Re-request review when ready

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what's best for the project
- Show empathy towards others

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions make Guided Ear Training better for musicians everywhere. We appreciate your time and effort in improving this project!

---

Questions? Open an issue or reach out to the maintainers.
