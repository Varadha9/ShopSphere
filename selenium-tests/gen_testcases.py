from openpyxl import Workbook
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter

wb = Workbook()

# ── helpers ──────────────────────────────────────────────────────────────────
def header_fill(hex_color): return PatternFill("solid", fgColor=hex_color)
def thin_border():
    s = Side(style="thin", color="BBBBBB")
    return Border(left=s, right=s, top=s, bottom=s)

PASS_FILL   = PatternFill("solid", fgColor="D9F2E6")
FAIL_FILL   = PatternFill("solid", fgColor="FCE4D6")
HEADER_FONT = Font(bold=True, color="FFFFFF", size=11)
TITLE_FONT  = Font(bold=True, size=13, color="1F3864")
CELL_FONT   = Font(size=10)

HEADERS = ["TC ID", "Module", "Test Case Title", "Preconditions",
           "Test Steps", "Test Data", "Expected Result", "Actual Result",
           "Status", "Priority", "Type"]

COL_WIDTHS = [8, 14, 36, 28, 52, 34, 36, 20, 10, 10, 14]

STATUS_FILL = {"PASS": PASS_FILL, "FAIL": FAIL_FILL,
               "": PatternFill("solid", fgColor="FFF2CC")}

def make_sheet(wb, title, color, test_cases, first=False):
    ws = wb.active if first else wb.create_sheet(title)
    ws.title = title
    ws.sheet_view.showGridLines = False

    # title row
    ws.merge_cells("A1:K1")
    ws["A1"] = f"BookSphere — {title} Test Cases"
    ws["A1"].font = TITLE_FONT
    ws["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws["A1"].fill = PatternFill("solid", fgColor="EBF3FB")
    ws.row_dimensions[1].height = 28

    # header row
    for col, (h, w) in enumerate(zip(HEADERS, COL_WIDTHS), 1):
        cell = ws.cell(row=2, column=col, value=h)
        cell.font = HEADER_FONT
        cell.fill = header_fill(color)
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = thin_border()
        ws.column_dimensions[get_column_letter(col)].width = w
    ws.row_dimensions[2].height = 22

    # data rows
    for r, tc in enumerate(test_cases, 3):
        ws.row_dimensions[r].height = 52
        for c, val in enumerate(tc, 1):
            cell = ws.cell(row=r, column=c, value=val)
            cell.font = CELL_FONT
            cell.alignment = Alignment(vertical="top", wrap_text=True)
            cell.border = thin_border()
            if c == 9:  # Status column
                cell.fill = STATUS_FILL.get(val, STATUS_FILL[""])
    return ws

# ═══════════════════════════════════════════════════════════════════════════════
# SHEET 1 — Login
# ═══════════════════════════════════════════════════════════════════════════════
login_tcs = [
    ["TC_L_01","Login","Valid email + password login",
     "User on login page\nInternet connected",
     "1. Open https://booksphere-dun.vercel.app\n2. Enter email: varadmandhare924@gmail.com\n3. Enter password: Varad@999\n4. Click 'Sign In →'",
     "Email: varadmandhare924@gmail.com\nPassword: Varad@999",
     "User is redirected to catalog/home page after successful login","","PASS","P1","Smoke"],

    ["TC_L_02","Login","Wrong password shows error",
     "User on login page",
     "1. Enter email: varadmandhare924@gmail.com\n2. Enter password: wrongpass\n3. Click 'Sign In →'",
     "Email: varadmandhare924@gmail.com\nPassword: wrongpass",
     "Error message displayed below form (class: lf-error-msg)","","FAIL","P1","Regression"],

    ["TC_L_03","Login","Empty email field — inline validation",
     "User on login page",
     "1. Leave email blank\n2. Enter password: Varad@999\n3. Click 'Sign In →'",
     "Email: (empty)\nPassword: Varad@999",
     "'Enter a valid email' error shown under email field","","","P1","Regression"],

    ["TC_L_04","Login","Empty password field — inline validation",
     "User on login page",
     "1. Enter email: varadmandhare924@gmail.com\n2. Leave password blank\n3. Click 'Sign In →'",
     "Email: varadmandhare924@gmail.com\nPassword: (empty)",
     "'Password is required' error shown under password field","","","P1","Regression"],

    ["TC_L_05","Login","Invalid email format rejected",
     "User on login page",
     "1. Enter email: notanemail\n2. Enter password: Varad@999\n3. Click 'Sign In →'",
     "Email: notanemail\nPassword: Varad@999",
     "'Enter a valid email' shown — form does not submit","","","P2","Regression"],

    ["TC_L_06","Login","Password toggle show/hide",
     "User on login page",
     "1. Enter password: Varad@999\n2. Click 👁️ icon\n3. Verify password is visible\n4. Click 🙈 icon\n5. Verify password is masked",
     "Password: Varad@999",
     "Password toggles between text and password type","","","P3","Functional"],

    ["TC_L_07","Login","Switch to Sign Up mode",
     "User on login page in Sign In mode",
     "1. Click 'Sign Up' toggle button\n2. Verify form now shows Full Name field",
     "N/A",
     "Form switches to register mode, Full Name field appears","","","P2","Functional"],

    ["TC_L_08","Login","Forgot password flow",
     "User on login page",
     "1. Enter email: varadmandhare924@gmail.com\n2. Click 'Forgot password?'\n3. Verify success message",
     "Email: varadmandhare924@gmail.com",
     "'✓ Reset link sent to varadmandhare924@gmail.com' shown","","","P2","Functional"],

    ["TC_L_09","Login","Session persists after page refresh",
     "User already logged in",
     "1. Login successfully\n2. Refresh the browser (F5)\n3. Check if user stays logged in",
     "Email: varadmandhare924@gmail.com\nPassword: Varad@999",
     "User remains on catalog page — not redirected to login","","","P1","Regression"],
]

# ═══════════════════════════════════════════════════════════════════════════════
# SHEET 2 — Catalog
# ═══════════════════════════════════════════════════════════════════════════════
catalog_tcs = [
    ["TC_C_01","Catalog","All books load on catalog page",
     "User logged in",
     "1. Login successfully\n2. Navigate to catalog page\n3. Count book cards displayed",
     "Valid login credentials",
     "12 book cards are displayed","","","P1","Smoke"],

    ["TC_C_02","Catalog","Search by book title — Atomic Habits",
     "User on catalog page",
     "1. Type 'Atomic' in the search input\n2. Observe filtered results",
     "Search query: Atomic",
     "Only books matching 'Atomic' tag/title are shown (≥1 result, fewer than total)","","","P1","Regression"],

    ["TC_C_03","Catalog","Search by author name",
     "User on catalog page",
     "1. Type author name in search input\n2. Observe results",
     "Search query: James Clear",
     "Books by James Clear appear in results","","","P2","Regression"],

    ["TC_C_04","Catalog","Search returns no results for garbage input",
     "User on catalog page",
     "1. Type 'xyzxyzxyz' in search input",
     "Search query: xyzxyzxyz",
     "Empty state / no books shown — no crash","","","P2","Regression"],

    ["TC_C_05","Catalog","Genre tree is visible",
     "User on catalog page",
     "1. Look for genre/category tree on the page",
     "N/A",
     "Genre tree nodes are visible and rendered","","","P1","Smoke"],

    ["TC_C_06","Catalog","Click genre node filters books",
     "User on catalog page, genre tree visible",
     "1. Click on a genre node (e.g. Fiction)\n2. Observe books shown",
     "Genre: Fiction",
     "Only books under Fiction category are displayed","","","P2","Regression"],

    ["TC_C_07","Catalog","Price sort — Low to High",
     "User on catalog page",
     "1. Select 'Price: Low to High' sort option\n2. Check order of displayed prices",
     "Sort: Price ascending",
     "Books displayed in ascending order of price","","","P2","Regression"],
]

# ═══════════════════════════════════════════════════════════════════════════════
# SHEET 3 — Cart
# ═══════════════════════════════════════════════════════════════════════════════
cart_tcs = [
    ["TC_CA_01","Cart","Add book to cart",
     "User logged in, on catalog page",
     "1. Click 'Add to Cart' on first book\n2. Navigate to /cart",
     "Any book card",
     "Cart page shows at least 1 item","","","P1","Smoke"],

    ["TC_CA_02","Cart","Remove item from cart",
     "Cart has at least 1 item",
     "1. Go to cart\n2. Click remove button on first item\n3. Verify item is gone",
     "N/A",
     "Item is removed from cart, count decreases by 1","","","P1","Regression"],

    ["TC_CA_03","Cart","Undo remove restores item (Stack DSA)",
     "Cart has at least 1 item",
     "1. Remove an item\n2. Click 'Undo' button\n3. Check item count",
     "N/A",
     "Removed item is restored — cart count goes back to original","","","P1","Regression"],

    ["TC_CA_04","Cart","Apply coupon BOOK30",
     "Cart has items, total ≥ ₹200",
     "1. Enter coupon code: BOOK30\n2. Click Apply\n3. Check discount shown",
     "Coupon: BOOK30\nMin spend: ₹200",
     "₹30 discount is applied and shown on cart total","","","P1","Regression"],

    ["TC_CA_05","Cart","Apply coupon BOOK80",
     "Cart total ≥ ₹500",
     "1. Enter coupon: BOOK80\n2. Click Apply",
     "Coupon: BOOK80\nMin spend: ₹500",
     "₹80 discount applied","","","P2","Regression"],

    ["TC_CA_06","Cart","Invalid coupon shows error",
     "Cart has items",
     "1. Enter coupon: FAKECODE\n2. Click Apply",
     "Coupon: FAKECODE",
     "Error or no discount applied — not crashes","","","P2","Regression"],

    ["TC_CA_07","Cart","Place standard order",
     "Cart has items, user logged in",
     "1. Click 'Place Order'\n2. Navigate to Orders page",
     "N/A",
     "Order appears on Orders page with PENDING status","","","P1","Regression"],
]

# ═══════════════════════════════════════════════════════════════════════════════
# SHEET 4 — Orders
# ═══════════════════════════════════════════════════════════════════════════════
orders_tcs = [
    ["TC_O_01","Orders","Orders page loads with placed orders",
     "User has placed at least one order",
     "1. Navigate to /orders\n2. Count order cards",
     "N/A",
     "Order cards are displayed","","","P1","Smoke"],

    ["TC_O_02","Orders","Premium order appears first (Priority Queue DSA)",
     "User is premium, has placed premium + standard orders",
     "1. Place a premium order\n2. Go to Orders page\n3. Check order of cards",
     "isPremium: true",
     "Premium order (priority=1) appears before standard (priority=10)","","","P1","Regression"],

    ["TC_O_03","Orders","Order status shows PENDING after placement",
     "Order just placed",
     "1. Place order\n2. Go to Orders page\n3. Check status label",
     "N/A",
     "Status badge shows PENDING","","","P2","Regression"],
]

# ═══════════════════════════════════════════════════════════════════════════════
# SHEET 5 — API
# ═══════════════════════════════════════════════════════════════════════════════
api_tcs = [
    ["TC_A_01","API","GET /books returns 200",
     "Valid anon key available",
     "1. Send GET to /rest/v1/books?select=*\n2. Include apikey header",
     "apikey: sb_publishable_5pi0OY09...",
     "HTTP 200, JSON array of 12 books","","","P1","API"],

    ["TC_A_02","API","GET /coupons returns 200",
     "Valid anon key available",
     "1. Send GET to /rest/v1/coupons?select=*\n2. Include apikey header",
     "apikey: sb_publishable_5pi0OY09...",
     "HTTP 200, JSON array of 4 coupons","","","P1","API"],

    ["TC_A_03","API","GET /books filtered by category",
     "Valid anon key available",
     "1. Send GET to /rest/v1/books?select=*&category=eq.Fiction",
     "category=Fiction",
     "HTTP 200, only Fiction books returned","","","P2","API"],

    ["TC_A_04","API","GET /books sorted by price",
     "Valid anon key available",
     "1. Send GET to /rest/v1/books?select=*&order=price.asc",
     "order=price.asc",
     "HTTP 200, books in ascending price order","","","P2","API"],

    ["TC_A_05","API","GET /carts without JWT returns 401",
     "No JWT token provided",
     "1. Send GET to /rest/v1/carts?select=*\n2. Only include apikey, no Authorization header",
     "No Authorization header",
     "HTTP 401 — private endpoint blocked","","","P1","API"],
]

# ═══════════════════════════════════════════════════════════════════════════════
# Build workbook
# ═══════════════════════════════════════════════════════════════════════════════
make_sheet(wb, "Login Tests",   "2E75B6", login_tcs,   first=True)
make_sheet(wb, "Catalog Tests", "375623", catalog_tcs)
make_sheet(wb, "Cart Tests",    "7030A0", cart_tcs)
make_sheet(wb, "Orders Tests",  "C55A11", orders_tcs)
make_sheet(wb, "API Tests",     "1F3864", api_tcs)

out = "/home/varad/projects/E-commerce/selenium-tests/BookSphere_TestCases.xlsx"
wb.save(out)
print(f"Saved: {out}")
