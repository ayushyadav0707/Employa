const fs = require('fs');

const file = 'src/components/profile/ProfileForm.tsx';
let content = fs.readFileSync(file, 'utf8');

// The block to move starts with "{/* Advanced Sections Toggles */}"
// and ends with "{/* Salary Accordion (Admin Only) */}" block end.

const advancedBlockStart = content.indexOf('{/* Advanced Sections Toggles */}');
if (advancedBlockStart === -1) {
  console.log('Could not find advanced block start');
  process.exit(1);
}

// Find the end of the Right column, which is the div closing the form.
// Actually, let's just use regex to extract the block.
// The block goes from `{/* Advanced Sections Toggles */}` to just before `</div>` and `</div>` of RIGHT COLUMN.

const regex = /(\s*\{\/\* Advanced Sections Toggles \*\/\}[\s\S]+?(?=\s*<\/div>\s*<\/div>\s*<\/form>))/;
const match = content.match(regex);

if (!match) {
  console.log('Could not match the block');
  process.exit(1);
}

const block = match[0];
content = content.replace(block, '');

// Now insert it into the Left Column, before `</div>` of the Left Column.
// The Left Column ends before `          {/* RIGHT COLUMN */}`

const insertRegex = /(\s*)(\s*<\/div>\s*\{\/\* RIGHT COLUMN \*\/\} )/;
// Actually, let's look for exactly:
/*
                </a>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN *\/}
*/
const insertTarget = `                </a>\n              </div>\n            )}\n          </div>\n\n          {/* RIGHT COLUMN */}`;
if (content.includes(insertTarget)) {
  const replacement = `                </a>\n              </div>\n            )}\n${block}\n          </div>\n\n          {/* RIGHT COLUMN */}`;
  content = content.replace(insertTarget, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Success!');
} else {
  // Let's try another target
  const insertTarget2 = `</a>\r\n              </div>\r\n            )}\r\n          </div>\r\n\r\n          {/* RIGHT COLUMN */}`;
  if (content.includes(insertTarget2)) {
    const replacement = `</a>\r\n              </div>\r\n            )}\r\n${block}\r\n          </div>\r\n\r\n          {/* RIGHT COLUMN */}`;
    content = content.replace(insertTarget2, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Success with CRLF!');
  } else {
    // try fuzzy search for insertion point
    const fallbackTargetRegex = /(<\/a>\s*<\/div>\s*\}\)\s*)(<\/div>\s*\{\/\* RIGHT COLUMN \*\/)/;
    const fallbackMatch = content.match(fallbackTargetRegex);
    if(fallbackMatch) {
       content = content.replace(fallbackTargetRegex, `$1${block}\n          $2`);
       fs.writeFileSync(file, content, 'utf8');
       console.log('Success with fallback regex!');
    } else {
       console.log('Could not find insertion point.');
    }
  }
}
