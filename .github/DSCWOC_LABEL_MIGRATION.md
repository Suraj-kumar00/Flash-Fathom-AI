# DSCWoC Label Migration Guide

This guide helps the project admin migrate labels from the old GSSoC/Hacktoberfest system to the new DSCWoC label system.

## Labels to Remove from All Issues

Remove these labels from all existing open issues:

- `hacktoberfest`
- `gssoc2025`
- `Level 1` (replace with `level-1`)
- `Level 2` (replace with `level-2`)
- `Level 3` (replace with `level-3`)

## Labels to Create

Run these commands using the [GitHub CLI](https://cli.github.com/):

```bash
# Program label
gh label create "dscwoc" --description "DSC Winter of Code program" --color "0075ca"

# Difficulty labels (lowercase with hyphen)
gh label create "level-1" --description "Beginner-friendly tasks (10 points)" --color "7057ff"
gh label create "level-2" --description "Moderate complexity tasks (20 points)" --color "ff9800"
gh label create "level-3" --description "Advanced or complex tasks (30 points)" --color "e11d48"

# Task-based labels (create if they don't exist)
gh label create "feature" --description "New functionality being added" --color "a2eeef"
gh label create "ui/ux" --description "Interface or user experience improvements" --color "f9d0c4"
gh label create "documentation" --description "README updates, guides, or written explanations" --color "0075ca"
gh label create "refactor" --description "Code restructuring without behavior change" --color "d4c5f9"
gh label create "testing" --description "Adding or improving automated tests" --color "bfd4f2"
```

## Issue Label Mapping

Below is the recommended label mapping for each open issue:

### Issue #106 - Delete Flashcard is not working
- **Remove:** `hacktoberfest`, `gssoc2025`, `Level 1`
- **Add:** `dscwoc`, `level-1`
- **Keep:** `bug`, `good first issue`

### Issue #101 - Improve the UI of the /generate Page Dashboard
- **Remove:** `hacktoberfest`, `gssoc2025`, `Level 2`
- **Add:** `dscwoc`, `level-2`, `ui/ux`
- **Keep:** `enhancement`, `good first issue`

### Issue #95 - Implement PDF-to-Flashcards Feature
- **Remove:** `hacktoberfest`, `gssoc2025`, `Level 3`
- **Add:** `dscwoc`, `level-3`, `feature`
- **Keep:** `enhancement`

### Issue #94 - Update Screenshot on /generate Page
- **Remove:** `hacktoberfest`, `gssoc2025`, `Level 1`
- **Add:** `dscwoc`, `level-1`, `documentation`
- **Keep:** `enhancement`, `good first issue`

### Issue #92 - Creator's Image Not Visible on Homepage
- **Remove:** `hacktoberfest`, `gssoc2025`, `Level 1`
- **Add:** `dscwoc`, `level-1`
- **Keep:** `bug`, `good first issue`

### Issue #91 - Improve Study Mode – Add Dedicated Navigation
- **Remove:** `hacktoberfest`, `gssoc2025`, `Level 3`
- **Add:** `dscwoc`, `level-3`, `ui/ux`
- **Keep:** `bug`, `enhancement`, `help wanted`

### Issue #87 - Missing pages
- **Remove:** `hacktoberfest`, `gssoc2025`, `Level 1`
- **Add:** `dscwoc`, `level-1`, `feature`
- **Keep:** `bug`, `enhancement`, `good first issue`

### Issue #86 - Feature Request: Add "Back to Top" Button
- **Remove:** `hacktoberfest`, `gssoc2025`, `Level 1`
- **Add:** `dscwoc`, `level-1`, `ui/ux`
- **Keep:** `enhancement`, `good first issue`
- **Note:** Remove `bug` label — this is a feature request, not a bug

### Issue #81 - Want to add new section community first
- **Remove:** `hacktoberfest`, `gssoc2025`, `Level 2`
- **Add:** `dscwoc`, `level-2`, `feature`, `ui/ux`
- **Keep:** `enhancement`

### Issue #113 - Navbar UI breaks with long usernames
- **Current labels:** None
- **Add:** `dscwoc`, `level-1`, `bug`, `ui/ux`, `good first issue`

### Issue #112 - Add logout confirmation dialog
- **Current labels:** None
- **Add:** `dscwoc`, `level-1`, `ui/ux`, `enhancement`, `good first issue`

### Issue #111 - Add Contact Page and Link It from Navbar
- **Current labels:** None
- **Add:** `dscwoc`, `level-2`, `feature`, `ui/ux`

### Issue #103 - Addition of PR create automate message
- **Current labels:** None
- **Add:** `dscwoc`, `level-1`, `enhancement`

### Issue #102 - Addition of automate issue create message
- **Current labels:** None
- **Add:** `dscwoc`, `level-1`, `enhancement`

## Bulk Migration Commands

After creating the new labels, run these commands to update existing issues:

```bash
# Remove old labels from all issues
for issue in 106 101 95 94 92 91 87 86 81; do
  gh issue edit $issue --remove-label "hacktoberfest" --remove-label "gssoc2025" 2>/dev/null
done

# Remove old Level labels and add new ones
gh issue edit 106 --remove-label "Level 1" --add-label "dscwoc,level-1"
gh issue edit 101 --remove-label "Level 2" --add-label "dscwoc,level-2,ui/ux"
gh issue edit 95 --remove-label "Level 3" --add-label "dscwoc,level-3,feature"
gh issue edit 94 --remove-label "Level 1" --add-label "dscwoc,level-1,documentation"
gh issue edit 92 --remove-label "Level 1" --add-label "dscwoc,level-1"
gh issue edit 91 --remove-label "Level 3" --add-label "dscwoc,level-3,ui/ux"
gh issue edit 87 --remove-label "Level 1" --add-label "dscwoc,level-1,feature"
gh issue edit 86 --remove-label "Level 1" --remove-label "bug" --add-label "dscwoc,level-1,ui/ux"
gh issue edit 81 --remove-label "Level 2" --add-label "dscwoc,level-2,feature,ui/ux"

# Add labels to unlabeled issues
gh issue edit 113 --add-label "dscwoc,level-1,bug,ui/ux,good first issue"
gh issue edit 112 --add-label "dscwoc,level-1,ui/ux,enhancement,good first issue"
gh issue edit 111 --add-label "dscwoc,level-2,feature,ui/ux"
gh issue edit 103 --add-label "dscwoc,level-1,enhancement"
gh issue edit 102 --add-label "dscwoc,level-1,enhancement"
```

## Optional: Delete Old Labels

After migration is complete, you can delete the old labels:

```bash
gh label delete "hacktoberfest" --yes
gh label delete "gssoc2025" --yes
gh label delete "Level 1" --yes
gh label delete "Level 2" --yes
gh label delete "Level 3" --yes
```
