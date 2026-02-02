<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Modular Kitchen Designs | InteriorDesign</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>

/* =========================
   GLOBAL RESET
========================= */
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:'Segoe UI',sans-serif;
}

body{
  background:#f4f6fb;
  color:#222;
  overflow-x:hidden;
}

/* =========================
   NAVBAR
========================= */
header{
  position:sticky;
  top:0;
  z-index:999;
  background:#fff;
  box-shadow:0 8px 25px rgba(0,0,0,.08);
}

.navbar{
  max-width:1300px;
  margin:auto;
  padding:18px 30px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

/* LOGO */
.logo{
  font-size:24px;
  font-weight:800;
  letter-spacing:1px;
}
.logo span{
  color:#c9a24d;
}

/* MENU */
.nav-menu{
  display:flex;
  gap:28px;
  align-items:center;
}

.nav-menu a{
  text-decoration:none;
  color:#333;
  font-size:15px;
  font-weight:600;
  position:relative;
  padding:8px 0;
}

/* underline animation */
.nav-menu a::after{
  content:'';
  position:absolute;
  left:0;
  bottom:-4px;
  width:0;
  height:3px;
  background:#c9a24d;
  transition:.4s;
}
.nav-menu a:hover::after{
  width:100%;
}

/* CTA BUTTON */
.nav-cta{
  background:#c9a24d;
  color:#fff !important;
  padding:12px 22px;
  border-radius:30px;
  box-shadow:0 10px 25px rgba(201,162,77,.4);
}
.nav-cta::after{display:none}

/* =========================
   HERO
========================= */
.hero{
  height:65vh;
  background:
    linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),
    url("https://images.unsplash.com/photo-1556912173-3bb406ef7e77");
  background-size:cover;
  background-position:center;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
}

.hero-content{
  color:#fff;
  animation:fadeUp 1.2s ease;
}

.hero h1{
  font-size:48px;
  margin-bottom:15px;
}
.hero p{
  max-width:700px;
  margin:auto;
  font-size:18px;
  opacity:.95;
}

@keyframes fadeUp{
  from{opacity:0;transform:translateY(40px)}
  to{opacity:1;transform:translateY(0)}
}

/* =========================
   PAGE CONTENT
========================= */
.container{
  max-width:1300px;
  margin:auto;
  padding:60px 30px;
}

.section-title{
  font-size:34px;
  margin-bottom:15px;
}
.section-desc{
  color:#666;
  max-width:800px;
  margin-bottom:40px;
  line-height:1.7;
}

/* =========================
   GRID
========================= */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:30px;
}

.card{
  background:#fff;
  border-radius:18px;
  overflow:hidden;
  box-shadow:0 18px 40px rgba(0,0,0,.12);
  transition:.4s;
}

.card:hover{
  transform:translateY(-10px);
}

.card img{
  width:100%;
  height:230px;
  object-fit:cover;
}

.card-body{
  padding:18px;
}

.card-body h3{
  font-size:18px;
  margin-bottom:6px;
}
.card-body p{
  font-size:14px;
  color:#666;
}

/* =========================
   CTA SECTION
========================= */
.cta{
  margin-top:80px;
  background:linear-gradient(135deg,#c9a24d,#e0bb6a);
  padding:60px;
  border-radius:25px;
  color:#fff;
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
}

.cta h2{
  font-size:32px;
}
.cta a{
  background:#fff;
  color:#333;
  padding:15px 30px;
  border-radius:30px;
  text-decoration:none;
  font-weight:700;
  margin-top:15px;
}

/* =========================
   FOOTER
========================= */
footer{
  background:#1e1e1e;
  color:#aaa;
  padding:50px 20px;
  text-align:center;
  margin-top:100px;
}
footer p{
  font-size:14px;
}

/* BASIC HEADER */
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 40px;
    background: #fff;
    border-bottom: 1px solid #e5e5e5;
    font-family: Arial, sans-serif;
}

nav ul {
    list-style: none;
    display: flex;
    gap: 30px;
}

nav ul li {
    position: relative;
}

nav ul li a {
    text-decoration: none;
    color: #333;
    font-size: 15px;
    font-weight: 500;
    padding: 8px 0;
}

/* DROPDOWN */
.dropdown {
    position: absolute;
    top: 120%;
    left: 0;
    background: #fff;
    min-width: 220px;
    display: none;
    flex-direction: column;
    padding: 12px 0;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    border-radius: 4px;
    z-index: 1000;
}

.dropdown a {
    padding: 10px 18px;
    font-size: 14px;
    color: #444;
    white-space: nowrap;
}

.dropdown a:hover {
    background: #f5f5f5;
    color: #c9a14a;
}

/* SHOW ON HOVER */
.has-dropdown:hover .dropdown {
    display: flex;
}

/* RIGHT BUTTON */
header > div:last-child a {
    text-decoration: none;
    background: #c9a14a;
    color: #fff;
    padding: 10px 18px;
    border-radius: 4px;
    font-size: 14px;
}


</style>
</head>

<body>

<header>
    <div>
        <h1>InteriorDesign</h1>
    </div>

    <nav>
        <ul>
            <li class="has-dropdown">
                <a href="#">Design Ideas</a>

                <!-- DROPDOWN -->
                <div class="dropdown">
                    <a href="kitchen.php">Modular Kitchen</a>
                    <a href="#">Living Room Designs</a>
                    <a href="#">Bedroom Designs</a>
                    <a href="#">Wardrobe Designs</a>
                    <a href="#">Bathroom Designs</a>
                    <a href="#">Balcony Designs</a>
                </div>
            </li>

            <li class="has-dropdown">
                <a href="#">Kitchens</a>
                <div class="dropdown">
                    <a href="#">L-Shape Kitchen</a>
                    <a href="#">U-Shape Kitchen</a>
                    <a href="#">Parallel Kitchen</a>
                    <a href="#">Island Kitchen</a>
                </div>
            </li>

            <li><a href="#">Bedrooms</a></li>
            <li><a href="#">Living Rooms</a></li>
            <li><a href="#">Wardrobes</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>

    <div>
        <a href="#">Book Free Consultation</a>
    </div>
</header>


<section class="hero">
  <div class="hero-content">
    <h1>Modular Kitchen Designs</h1>
    <p>Explore premium modular kitchen designs curated for Indian homes.</p>
  </div>
</section>

<section class="container">
  <h2 class="section-title">Popular Kitchen Designs</h2>
  <p class="section-desc">
    Discover modern, luxury and budget-friendly kitchen layouts designed for efficiency and beauty.
  </p>

  <div class="grid">

    <!-- 15+ cards -->
    <!-- (Same pattern, clean, consistent) -->

    <!-- CARD -->
    <div class="card">
      <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77">
      <div class="card-body">
        <h3>L-Shape Modular Kitchen</h3>
        <p>Maximum storage • Indian layout</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4">
      <div class="card-body">
        <h3>U-Shape Kitchen</h3>
        <p>Premium cabinets • Quartz top</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea">
      <div class="card-body">
        <h3>Compact Kitchen</h3>
        <p>Small homes • Smart design</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77">
      <div class="card-body">
        <h3>L-Shape Modular Kitchen</h3>
        <p>Maximum storage • Indian layout</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4">
      <div class="card-body">
        <h3>U-Shape Kitchen</h3>
        <p>Premium cabinets • Quartz top</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea">
      <div class="card-body">
        <h3>Compact Kitchen</h3>
        <p>Small homes • Smart design</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77">
      <div class="card-body">
        <h3>L-Shape Modular Kitchen</h3>
        <p>Maximum storage • Indian layout</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4">
      <div class="card-body">
        <h3>U-Shape Kitchen</h3>
        <p>Premium cabinets • Quartz top</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea">
      <div class="card-body">
        <h3>Compact Kitchen</h3>
        <p>Small homes • Smart design</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77">
      <div class="card-body">
        <h3>L-Shape Modular Kitchen</h3>
        <p>Maximum storage • Indian layout</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4">
      <div class="card-body">
        <h3>U-Shape Kitchen</h3>
        <p>Premium cabinets • Quartz top</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea">
      <div class="card-body">
        <h3>Compact Kitchen</h3>
        <p>Small homes • Smart design</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77">
      <div class="card-body">
        <h3>L-Shape Modular Kitchen</h3>
        <p>Maximum storage • Indian layout</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4">
      <div class="card-body">
        <h3>U-Shape Kitchen</h3>
        <p>Premium cabinets • Quartz top</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea">
      <div class="card-body">
        <h3>Compact Kitchen</h3>
        <p>Small homes • Smart design</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77">
      <div class="card-body">
        <h3>L-Shape Modular Kitchen</h3>
        <p>Maximum storage • Indian layout</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4">
      <div class="card-body">
        <h3>U-Shape Kitchen</h3>
        <p>Premium cabinets • Quartz top</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea">
      <div class="card-body">
        <h3>Compact Kitchen</h3>
        <p>Small homes • Smart design</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600489000022-c2086d79f9d4">
      <div class="card-body">
        <h3>U-Shape Kitchen</h3>
        <p>Premium cabinets • Quartz top</p>
      </div>
    </div>

    <div class="card">
      <img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea">
      <div class="card-body">
        <h3>Compact Kitchen</h3>
        <p>Small homes • Smart design</p>
      </div>
    </div>

  </div>

  <div class="cta">
    <h2>Get Free Modular Kitchen Consultation</h2>
    <a href="index.php">Book Now</a>
  </div>

</section>

<footer>
  <p>© 2026 InteriorDesign. All Rights Reserved.</p>
</footer>

</body>
</html>
