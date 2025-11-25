export const generateMarkdownDoc = (title: string, sections: Array<{ title: string; content: string }>) => {
  let markdown = `# ${title}\n\n`;
  
  sections.forEach(section => {
    markdown += `## ${section.title}\n\n`;
    markdown += `${section.content}\n\n`;
  });
  
  return markdown;
};

export const downloadMarkdown = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.md`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
