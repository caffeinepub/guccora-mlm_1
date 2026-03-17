import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, ImageOff, Package, Plus, Star, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "guccora_products";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

const emptyForm = (): Omit<Product, "id" | "createdAt"> => ({
  name: "",
  description: "",
  price: 0,
  imageUrl: "",
  category: "health",
  isActive: true,
});

const CATEGORIES = [
  { value: "health", label: "Health & Wellness" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "nutrition", label: "Nutrition" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "technology", label: "Technology" },
  { value: "other", label: "Other" },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-1",
    name: "Guccora Premium Bag",
    description:
      "Handcrafted luxury bag with premium leather finish. A signature GUCCORA piece that combines elegance with practicality for the modern entrepreneur.",
    price: 1999,
    imageUrl: "/assets/generated/product-bag.dim_400x400.jpg",
    category: "lifestyle",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    name: "Guccora Gold Membership Kit",
    description:
      "Exclusive gold-tier membership welcome kit with premium branding materials, training manuals, and network access credentials for serious networkers.",
    price: 2999,
    imageUrl: "/assets/generated/product-membership-kit.dim_400x400.jpg",
    category: "lifestyle",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    name: "Guccora Training Course",
    description:
      "Comprehensive MLM success training program covering binary network building, income strategies, leadership skills, and digital marketing techniques.",
    price: 999,
    imageUrl: "/assets/generated/product-training.dim_400x400.jpg",
    category: "other",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-4",
    name: "Guccora Business Starter Kit",
    description:
      "Everything you need to launch your GUCCORA business — business cards, brochures, presentation materials, and digital tools to grow your downline fast.",
    price: 499,
    imageUrl: "/assets/generated/product-starter-kit.dim_400x400.jpg",
    category: "other",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.length > 0) return parsed;
    }
    // Seed demo products on first load
    saveProducts(DEMO_PRODUCTS);
    return DEMO_PRODUCTS;
  } catch {
    return DEMO_PRODUCTS;
  }
}

function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  const persist = (updated: Product[]) => {
    setProducts(updated);
    saveProducts(updated);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl ?? "",
      category: p.category,
      isActive: p.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (form.price <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (editingId) {
      const updated = products.map((p) =>
        p.id === editingId ? { ...p, ...form } : p,
      );
      persist(updated);
      toast.success("Product updated successfully");
    } else {
      const newProduct: Product = {
        ...form,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      persist([...products, newProduct]);
      toast.success("Product added successfully");
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    persist(products.filter((p) => p.id !== deleteId));
    toast.success("Product deleted");
    setDeleteId(null);
  };

  const toggleActive = (id: string) => {
    persist(
      products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Package size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold gold-gradient-text">
              Products
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your product catalog
            </p>
          </div>
        </div>
        <Button
          className="gold-gradient text-primary-foreground font-semibold gap-2"
          onClick={openAdd}
          data-ocid="products.primary_button"
        >
          <Plus size={16} />
          Add Product
        </Button>
      </motion.div>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="products.empty_state"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
            <Package size={36} className="text-primary/40" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">
            No Products Yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Add your first product to showcase in the network
          </p>
          <Button
            className="gold-gradient text-primary-foreground"
            onClick={openAdd}
            data-ocid="products.secondary_button"
          >
            <Plus size={16} className="mr-2" /> Add First Product
          </Button>
        </motion.div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="products.list"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              data-ocid={`products.item.${i + 1}`}
            >
              <Card
                className={`bg-card border-border card-glow overflow-hidden transition-all duration-300 hover:border-primary/40 ${
                  !product.isActive ? "opacity-60" : ""
                }`}
              >
                {product.imageUrl ? (
                  <div className="h-44 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <ImageOff size={32} className="text-primary/20" />
                  </div>
                )}

                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display text-base font-semibold line-clamp-1">
                      {product.name}
                    </CardTitle>
                    <Badge
                      className={`shrink-0 text-xs ${
                        product.isActive
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                      variant="outline"
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground capitalize">
                      {CATEGORIES.find((c) => c.value === product.category)
                        ?.label ?? product.category}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="font-display text-xl font-bold gold-gradient-text">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star
                        size={12}
                        className="text-primary"
                        fill="currentColor"
                      />
                      <span className="text-xs text-muted-foreground">
                        Premium
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={() => toggleActive(product.id)}
                        data-ocid={`products.switch.${i + 1}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => openEdit(product)}
                        data-ocid={`products.edit_button.${i + 1}`}
                      >
                        <Edit2 size={13} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(product.id)}
                        data-ocid={`products.delete_button.${i + 1}`}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="products.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display gold-gradient-text">
              {editingId ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Product Name *</Label>
              <Input
                placeholder="e.g. GUCCORA Gold Serum"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-ocid="products.input"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the product..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                data-ocid="products.textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  placeholder="999"
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  data-ocid="products.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger data-ocid="products.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Image URL (optional)</Label>
              <Input
                placeholder="https://..."
                value={form.imageUrl ?? ""}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                data-ocid="products.input"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                data-ocid="products.switch"
              />
              <Label>Active (visible on site)</Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              data-ocid="products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="gold-gradient text-primary-foreground"
              onClick={handleSubmit}
              data-ocid="products.save_button"
            >
              {editingId ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent
          className="bg-card border-border"
          data-ocid="products.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed from your catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="products.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              data-ocid="products.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
