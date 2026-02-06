# MohnMenu - Contributing Guide

## How to Contribute

We welcome contributions from developers, designers, and product managers!

### Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/mohnmenu.git
cd mohnmenu
```

3. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

4. Install dependencies:
```bash
cd restaurant-app
npm install
```

5. Start development:
```bash
npm run dev
```

### Development Workflow

1. **Make your changes** in your feature branch
2. **Test locally**:
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

3. **Write/update tests** for new features
4. **Create a Pull Request** with a clear description
5. **Link related issues** in the PR description

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(chef-cam): add live kitchen streaming
fix(auth): resolve multi-tenant isolation bug
docs(setup): update Firebase configuration guide
```

### Code Style

- Use TypeScript for all TypeScript files
- Follow existing code patterns
- Run `npm run lint` before committing
- Max line length: 100 characters
- Use meaningful variable names

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ChefCameraStream.test.tsx
```

## Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Missing or unclear documentation
- `help wanted` - Need community help
- `good first issue` - Good for beginners
- `high priority` - Critical or urgent

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers
6. Address review feedback
7. Squash commits before merge

## Areas to Contribute

### Code
- Performance optimizations
- Bug fixes
- New features
- Accessibility improvements
- Mobile responsiveness

### Documentation
- README improvements
- API documentation
- Setup guides
- Troubleshooting guides
- Code examples

### Infrastructure
- GitHub Actions workflows
- Firebase configuration
- Cloud function improvements
- Database optimization

## Questions?

- **Discord**: [Join our community](#)
- **Email**: hello@mohnmenu.com
- **Discussions**: GitHub Discussions tab

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

---

Thank you for contributing to MohnMenu! 🎉
