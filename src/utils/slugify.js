const slugify = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')          
      .replace(/\-\-+/g, '-')        
  }
  
  export default slugify