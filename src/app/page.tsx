// import Image from "next/image";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol>
//           <li>
//             Get started by editing <code>src/app/page.tsx</code>.
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>

//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.secondary}
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className={styles.footer}>
//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }

// app/page.tsx
'use client';

import { useCallback, useState } from 'react';
import { go, initCtx } from '../interpreter/basics';
import * as util from 'util';
import { valOf } from '../interpreter/normalize';
import { rep } from '../interpreter/rep';
import { parsePie, syntaxParse } from '../interpreter/parser';
import styles from './page.module.css';

export default function Home() {
  const [output, setOutput] = useState('');

  const processInput = useCallback((input: string) => {
    try {
      const src = parsePie(input);
      //console.log(rep(initCtx, src)[2][2]);
      const customStringify = (obj: any): string => {
        if (typeof obj === 'symbol') {
          return obj.toString();
        } else if (Array.isArray(obj)) {
          return `[${obj.map(customStringify).join(', ')}]`;
        } else if (typeof obj === 'object' && obj !== null) {
          return `{${Object.entries(obj).map(([key, value]) => `${key}: ${customStringify(value)}`).join(', ')}}`;
        } else {
          return String(obj);
        }
      };
      return `${customStringify((rep(initCtx, src) as go<any>).result)}`;
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }, []);

  const handleProcess = () => {
    const inputBox = document.getElementById('inputBox') as HTMLTextAreaElement;
    const result = processInput(inputBox.value);
    setOutput(result);
  };

  return (
    <main className={styles.main}>
      <div className={styles.box}>
        <label htmlFor="inputBox">Input:</label>
        <textarea 
          id="inputBox" 
          placeholder="Enter your input here..."
        />
      </div>

      <button 
        onClick={handleProcess}
        className={styles.button}
      >
        Process
      </button>

      <div className={styles.box}>
        <label htmlFor="outputBox">Output:</label>
        <textarea 
          id="outputBox"
          value={output}
          readOnly
          placeholder="Output will appear here..."
        />
      </div>
    </main>
  );
}