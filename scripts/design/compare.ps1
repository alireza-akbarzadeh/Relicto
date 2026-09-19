param(
  [string]$A, [string]$B, [int]$X, [int]$Y, [int]$W, [int]$H, [string]$Out, [int]$Scale = 1
)
Add-Type -AssemblyName System.Drawing
if (-not ("PixelCompare" -as [type])) {
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
public static class PixelCompare {
  // Side-by-side: stitch | mine | diff heatmap. Returns share of pixels differing by > threshold.
  public static double Compose(string a, string b, Rectangle r, string output, int scale) {
    using (var ia = new Bitmap(a)) using (var ib = new Bitmap(b)) {
      int w = Math.Min(r.Width, Math.Min(ia.Width - r.X, ib.Width - r.X));
      int h = Math.Min(r.Height, Math.Min(ia.Height - r.Y, ib.Height - r.Y));
      var rect = new Rectangle(r.X, r.Y, w, h);
      using (var ca = ia.Clone(rect, PixelFormat.Format32bppArgb))
      using (var cb = ib.Clone(rect, PixelFormat.Format32bppArgb))
      using (var diff = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
        long bad = 0;
        for (int yy = 0; yy < h; yy++) for (int xx = 0; xx < w; xx++) {
          Color pa = ca.GetPixel(xx, yy), pb = cb.GetPixel(xx, yy);
          int d = Math.Abs(pa.R - pb.R) + Math.Abs(pa.G - pb.G) + Math.Abs(pa.B - pb.B);
          if (d > 60) bad++;
          int v = Math.Min(255, d * 2);
          diff.SetPixel(xx, yy, Color.FromArgb(255, v, v / 4, 0));
        }
        int gap = 6;
        using (var canvas = new Bitmap((w * 3 + gap * 2) * scale, h * scale))
        using (var g = Graphics.FromImage(canvas)) {
          g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.NearestNeighbor;
          g.Clear(Color.Magenta);
          g.DrawImage(ca, 0, 0, w * scale, h * scale);
          g.DrawImage(cb, (w + gap) * scale, 0, w * scale, h * scale);
          g.DrawImage(diff, (w * 2 + gap * 2) * scale, 0, w * scale, h * scale);
          canvas.Save(output, ImageFormat.Png);
        }
        return (double)bad / (w * h);
      }
    }
  }
}
"@
}
$ratio = [PixelCompare]::Compose($A, $B, (New-Object System.Drawing.Rectangle $X, $Y, $W, $H), $Out, $Scale)
"{0:P2} of pixels differ" -f $ratio
