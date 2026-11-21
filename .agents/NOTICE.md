# Third-party skills

The folders under `.agents/skills/` are copied unmodified from
[mattpocock/skills](https://github.com/mattpocock/skills).

- Version: `v1.3.2`
- Commit: `d1478fcb140db0b93c0c8df17bcfd311844749d0`
- Skills included: `grill-me`, `grilling`, `to-spec`, `to-tickets`, `implement`, `tdd`, `code-review`, `codebase-design`, `setup-matt-pocock-skills`

`docs/agents/issue-tracker.md`, `docs/agents/domain.md` and `docs/agents/triage-labels.md` are the
seed templates from the `setup-matt-pocock-skills` skill, written out as that skill would for a
local-markdown tracker, with one change: the "Wayfinding operations" section is removed from
`issue-tracker.md`, because the `wayfinder` skill is not installed and the section made `/implement`
mark tickets `resolved` and add an `## Answer` heading. `triage-labels.md` is included even though the `triage` skill is not
installed, because `to-spec` and `to-tickets` expect the label vocabulary to be present.

They are pinned to this version on purpose, so the workshop lessons match what you see.
To use the latest version in your own project, run:

```
npx skills@latest add mattpocock/skills -a cursor
```

## License

MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
