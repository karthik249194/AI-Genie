// This runs in the Figma plugin sandbox
figma.showUI(__html__, { width: 900, height: 700, themeColors: true });

figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'export-slides':
      await exportToSlides(msg.data);
      break;
    
    case 'create-frame':
      await createFrameWithContent(msg.data);
      break;
    
    case 'resize':
      figma.ui.resize(msg.width, msg.height);
      break;
    
    case 'notify':
      figma.notify(msg.message, { timeout: 3000 });
      break;
    
    case 'close':
      figma.closePlugin();
      break;
  }
};

async function exportToSlides(data: { content: string; title: string }) {
  const page = figma.currentPage;
  const slideWidth = 1920;
  const slideHeight = 1080;
  
  // Create a new frame for the slide
  const frame = figma.createFrame();
  frame.name = data.title || 'Research Insight';
  frame.resize(slideWidth, slideHeight);
  frame.x = page.children.length * (slideWidth + 100);
  frame.y = 0;
  
  // Add background
  frame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }];
  
  // Add title
  const title = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  title.fontName = { family: "Inter", style: "Bold" };
  title.fontSize = 48;
  title.characters = data.title || 'Research Insight';
  title.x = 80;
  title.y = 80;
  title.resize(slideWidth - 160, title.height);
  frame.appendChild(title);
  
  // Add content
  const content = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  content.fontName = { family: "Inter", style: "Regular" };
  content.fontSize = 24;
  content.characters = data.content;
  content.x = 80;
  content.y = 200;
  content.resize(slideWidth - 160, slideHeight - 280);
  content.textAutoResize = "HEIGHT";
  frame.appendChild(content);
  
  figma.viewport.scrollAndZoomIntoView([frame]);
  figma.ui.postMessage({ type: 'export-complete' });
  figma.notify('Slide created successfully!');
}

async function createFrameWithContent(data: { content: string }) {
  const frame = figma.createFrame();
  frame.name = 'Insight Export';
  frame.resize(800, 600);
  
  const text = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  text.fontName = { family: "Inter", style: "Regular" };
  text.fontSize = 16;
  text.characters = data.content;
  text.resize(760, 560);
  text.x = 20;
  text.y = 20;
  
  frame.appendChild(text);
  figma.currentPage.appendChild(frame);
  figma.viewport.scrollAndZoomIntoView([frame]);
}
