let siteConfig = JSON.parse(localStorage.getItem("JB_CONFIG") || "null") || DEFAULT_CONFIG;

function saveConfig(){
  localStorage.setItem("JB_CONFIG", JSON.stringify(siteConfig));
  renderAll();
}

function renderAll(){
  document.getElementById("brandName").textContent = siteConfig.brandName;
  document.getElementById("brandSubtitle").textContent = siteConfig.brandSubtitle;
  document.getElementById("heroPill").textContent = siteConfig.heroPill;
  document.getElementById("heroTitle").textContent = siteConfig.heroTitle;
  document.getElementById("heroText").textContent = siteConfig.heroText;
  document.getElementById("hero").style.backgroundImage = `linear-gradient(115deg,rgba(33,21,13,.9),rgba(200,107,45,.55)), url('${siteConfig.heroImage}')`;
  renderEbooks();
  renderPlans();
  fillAdmin();
}

function renderEbooks(){
  const grid = document.getElementById("ebookGrid");
  grid.innerHTML = "";
  siteConfig.ebooks.forEach(book => {
    const article = document.createElement("article");
    article.className = "card ebook";
    article.innerHTML = `
      <img src="${book.image}" onerror="this.src='imagenes/placeholder.svg'" alt="${book.title}">
      <span class="tag">E-book PDF</span>
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      <a class="btn primary" href="${book.pdf}" target="_blank">Abrir PDF</a>
    `;
    grid.appendChild(article);
  });
}

function renderPlans(){
  const p = siteConfig.payments;
  document.getElementById("plansGrid").innerHTML = `
    <article class="card plan">
      <span class="tag">Venta directa</span>
      <h3>Comprar e-books</h3>
      <div class="price">$13.500</div>
      <p>Precio editable para venta individual.</p>
      <a class="btn primary" href="${p.shopify}" target="_blank">Comprar en Shopify</a>
    </article>
    <article class="card plan featured">
      <span class="tag">Recomendado</span>
      <h3>Membresía Premium</h3>
      <div class="price">$8.999/mes</div>
      <p>Acceso a todos los e-books, bonus y actualizaciones.</p>
      <a class="btn white" href="${p.mercadoPago}" target="_blank">Pagar con Mercado Pago</a>
    </article>
    <article class="card plan">
      <span class="tag">Afiliados</span>
      <h3>Hotmart</h3>
      <div class="price">Digital</div>
      <p>Preparado para venta automática y afiliados.</p>
      <a class="btn primary" href="${p.hotmart}" target="_blank">Comprar en Hotmart</a>
    </article>
  `;
}

function fillAdmin(){
  document.getElementById("editBrandName").value = siteConfig.brandName;
  document.getElementById("editBrandSubtitle").value = siteConfig.brandSubtitle;
  document.getElementById("editHeroTitle").value = siteConfig.heroTitle;
  document.getElementById("editHeroText").value = siteConfig.heroText;
  document.getElementById("editHeroPill").value = siteConfig.heroPill;
  document.getElementById("editHeroImage").value = siteConfig.heroImage;
  document.getElementById("editShopify").value = siteConfig.payments.shopify;
  document.getElementById("editMercadoPago").value = siteConfig.payments.mercadoPago;
  document.getElementById("editHotmart").value = siteConfig.payments.hotmart;

  const editor = document.getElementById("ebookEditor");
  editor.innerHTML = "";
  siteConfig.ebooks.forEach((book, i) => {
    const row = document.createElement("div");
    row.className = "editorRow";
    row.innerHTML = `
      <div><label>Título ${i+1}</label><input id="bookTitle${i}" value="${book.title}"></div>
      <div><label>Descripción ${i+1}</label><input id="bookDesc${i}" value="${book.description}"></div>
      <div><label>Imagen ${i+1}</label><input id="bookImage${i}" value="${book.image}"></div>
      <div><label>PDF ${i+1}</label><input id="bookPdf${i}" value="${book.pdf}"></div>
    `;
    editor.appendChild(row);
  });
}

function saveMain(){
  siteConfig.brandName = document.getElementById("editBrandName").value;
  siteConfig.brandSubtitle = document.getElementById("editBrandSubtitle").value;
  siteConfig.heroTitle = document.getElementById("editHeroTitle").value;
  siteConfig.heroText = document.getElementById("editHeroText").value;
  siteConfig.heroPill = document.getElementById("editHeroPill").value;
  siteConfig.heroImage = document.getElementById("editHeroImage").value;
  saveConfig();
  alert("Contenido principal guardado.");
}

function savePayments(){
  siteConfig.payments.shopify = document.getElementById("editShopify").value;
  siteConfig.payments.mercadoPago = document.getElementById("editMercadoPago").value;
  siteConfig.payments.hotmart = document.getElementById("editHotmart").value;
  saveConfig();
  alert("Links de pago guardados.");
}

function saveEbooks(){
  siteConfig.ebooks = siteConfig.ebooks.map((book, i) => ({
    title: document.getElementById("bookTitle"+i).value,
    description: document.getElementById("bookDesc"+i).value,
    image: document.getElementById("bookImage"+i).value,
    pdf: document.getElementById("bookPdf"+i).value
  }));
  saveConfig();
  alert("E-books guardados.");
}

function exportConfig(){
  document.getElementById("exportBox").value = "const DEFAULT_CONFIG = " + JSON.stringify(siteConfig, null, 2) + ";";
}

const chat = document.getElementById("chat");
const question = document.getElementById("question");

function addMessage(text,type){
  const div=document.createElement("div");
  div.className="msg "+type;
  div.textContent=text;
  chat.appendChild(div);
  chat.scrollTop=chat.scrollHeight;
}

function answer(text){
  const s=text.toLowerCase();
  if(s.includes("pollo")||s.includes("arroz")) return "Con pollo y arroz podés preparar un bowl saludable con verduras y salsa liviana.";
  if(s.includes("vender")||s.includes("dulce")) return "Para vender te recomiendo cookies New York, brownies, alfajores y budines.";
  if(s.includes("menú")||s.includes("semana")) return "Un menú semanal puede incluir pollo, pescado, huevos, legumbres, verduras, arroz y frutas.";
  if(s.includes("costo")||s.includes("precio")) return "Fórmula simple: ingredientes + packaging + tiempo. Luego multiplicá por 2.5 o 3.";
  return "IA Chef JB puede ayudarte a crear recetas, adaptar ingredientes, calcular porciones y pensar productos para vender.";
}

function askAI(){
  const text=question.value.trim();
  if(!text)return;
  addMessage(text,"user");
  question.value="";
  setTimeout(()=>addMessage(answer(text),"bot"),350);
}

question.addEventListener("keydown",e=>{if(e.key==="Enter")askAI();});
renderAll();
