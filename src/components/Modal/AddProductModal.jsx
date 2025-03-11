import { useCallback, useEffect, useState } from "react";
import { FiTrash2, FiPlus, FiUpload } from "react-icons/fi";
import { createContext } from "react";
import { toast } from "react-toastify";
import {
  findAllCategory, findSpecificationsByProductId, createProduct, createSpecification,
  findProductById, uploadImagesToCloudinary, updateProduct, updateSpecification
} from "../../routers/ApiRoutes";
import { useDropzone } from "react-dropzone";
import { ClockLoader } from "react-spinners";
import { FaTimes } from "react-icons/fa";

export const ToastContext = createContext();

export default function AddProductModal({ setShowProductModal, product_id }) {

  const [updateProductId, setUpdateProductId] = useState(product_id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [weight, setWeight] = useState(0);
  const [guaranteePeriod, setGuaranteePeriod] = useState(0);
  const [images, setImages] = useState([]);
  const [imagesUpdate, setImagesUpdate] = useState([]);

  const [brandSelected, setBrandSelected] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" });
  const [specifications, setSpecifications] = useState([{ name: "", name_vi: "", value: "" }]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [inventorys, setInventorys] = useState([])
  const [loading, setLoading] = useState(false)
  const [isAllowUpdate, setIsAllowUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [categories, setCategories] = useState([]);
  const [specsFields, setSpecsFields] = useState([]);
  const [productData, setProductData] = useState({});

  useEffect(() => {
    if (selectedCategory.name) {
      setSpecsFields(specDefinitions[selectedCategory.name] || []);
    } else {
      setSpecsFields([]);
    }
  }, [selectedCategory]);
  const specDefinitions = {
    HEADPHONE: [
      { key: "warranty", value: "Bảo hành", options: ["6 tháng", "12 tháng", "24 tháng"] },
      { key: "type", value: "Kiểu", options: ["Over-ear", "On-ear", "In-ear", "True Wireless"] },
      { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth", "USB-C"] },
      { key: "battery_life", value: "Thời lượng pin", options: ["4 giờ", "8 giờ", "12 giờ", "24 giờ", "40 giờ"] },
      { key: "noise_cancellation", value: "Khử tiếng ồn chủ động", options: ["Có", "Không"] },
      { key: "microphone", value: "Microphone", options: ["Có", "Không", "Đa hướng"] },
      { key: "frequency_response", value: "Dải tần số", options: ["20Hz - 20kHz", "15Hz - 25kHz", "5Hz - 40kHz"] },
    ],
    KEYBOARD: [
      { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng", "36 tháng"] },
      { key: "switch_type", value: "Loại switch", options: ["Mechanical", "Membrane", "Optical", "Hybrid"] },
      { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth", "USB-C"] },
      { key: "backlight", value: "Đèn nền", options: ["Có", "Không", "RGB", "Single-color"] },
      { key: "key_rollover", value: "Số lượng phím nhận diện cùng lúc", options: ["6-key", "N-key"] },
    ],
    MOUSE: [
      { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng"] },
      { key: "sensor_type", value: "Loại cảm biến", options: ["Optical", "Laser", "Infrared"] },
      { key: "dpi", value: "Độ phân giải DPI", options: ["800", "1600", "3200", "6400", "12000", "16000"] },
      { key: "connection", value: "Kết nối", options: ["Wired", "Wireless", "Bluetooth", "USB-C"] },
      { key: "buttons", value: "Số nút", options: ["3", "5", "7", "10", "12+"] },
      { key: "battery_life", value: "Thời lượng pin", options: ["20 giờ", "50 giờ", "100 giờ"] },
    ],
    RAM: [
      { key: "warranty", value: "Bảo hành", options: ["36 tháng", "60 tháng", "Trọn đời"] },
      { key: "capacity", value: "Dung lượng", options: ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"] },
      { key: "speed", value: "Tốc độ bus", options: ["2133MHz", "2666MHz", "3200MHz", "3600MHz", "4000MHz+"] },
      { key: "latency", value: "Độ trễ CAS", options: ["CL14", "CL16", "CL18", "CL20"] },
      { key: "voltage", value: "Điện áp", options: ["1.2V", "1.35V", "1.5V"] },
      { key: "type", value: "Loại RAM", options: ["DDR3", "DDR4", "DDR5", "LPDDR5"] },
    ],
    SSD_HDD: [
      { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng", "36 tháng", "60 tháng"] },
      { key: "type", value: "Loại ổ", options: ["SSD", "HDD", "NVMe", "Hybrid"] },
      { key: "capacity", value: "Dung lượng", options: ["256GB", "512GB", "1TB", "2TB", "4TB", "8TB"] },
      { key: "interface", value: "Giao tiếp", options: ["SATA", "NVMe", "PCIe", "USB 3.2"] },
      { key: "speed", value: "Tốc độ đọc/ghi", options: ["500MB/s", "1000MB/s", "2000MB/s", "5000MB/s"] },
    ],
    PSU: [
      { key: "warranty", value: "Bảo hành", options: ["36 tháng", "60 tháng"] },
      { key: "wattage", value: "Công suất", options: ["400W", "500W", "600W", "750W", "850W", "1000W", "1200W+"] },
      { key: "efficiency", value: "Chứng nhận hiệu suất", options: ["80 Plus", "80 Plus Bronze", "80 Plus Gold", "80 Plus Platinum", "80 Plus Titanium"] },
      { key: "modular", value: "Dây cáp rời", options: ["Có", "Không", "Semi-Modular"] },
    ],
    MAINBOARD: [
      { key: "warranty", value: "Bảo hành", options: ["12 tháng", "24 tháng", "36 tháng"] },
      { key: "socket", value: "Socket", options: ["LGA1200", "LGA1700", "AM4", "AM5"] },
      { key: "chipset", value: "Chipset", options: ["B460", "B560", "Z490", "Z590", "X570", "B550"] },
      { key: "form_factor", value: "Kích thước", options: ["ATX", "Micro-ATX", "Mini-ITX"] },
      { key: "ram_slots", value: "Số khe RAM", options: ["2", "4", "8"] },
      { key: "max_memory", value: "Dung lượng RAM tối đa", options: ["32GB", "64GB", "128GB"] },
      { key: "storage_interfaces", value: "Giao tiếp lưu trữ", options: ["SATA", "NVMe", "PCIe 4.0"] },
      { key: "expansion_slots", value: "Khe mở rộng", options: ["PCIe x16", "PCIe x8", "PCIe x4"] },
      { key: "usb_ports", value: "Cổng USB", options: ["USB 2.0", "USB 3.0", "USB 3.1", "USB-C"] },
      { key: "network", value: "Kết nối mạng", options: ["Ethernet", "Wi-Fi 6", "Bluetooth"] },
    ],
    HEATSINK: [
      { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "24 THÁNG", "36 THÁNG"] },
      { key: "type", value: "LOẠI", options: ["TẢN NHIỆT KHÍ", "TẢN NHIỆT NƯỚC"] },
      { key: "fan_size", value: "KÍCH THƯỚC QUẠT", options: ["92MM", "120MM", "140MM"] },
      { key: "heat_pipes", value: "SỐ ỐNG DẪN NHIỆT", options: ["2", "4", "6"] },
      { key: "compatibility", value: "TƯƠNG THÍCH CPU", options: ["INTEL", "AMD", "CẢ HAI"] }
    ],
    RAM: [
      { key: "warranty", value: "BẢO HÀNH", options: ["36 THÁNG", "60 THÁNG", "TRỌN ĐỜI"] },
      { key: "capacity", value: "DUNG LƯỢNG", options: ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB"] },
      { key: "speed", value: "TỐC ĐỘ BUS", options: ["2133MHZ", "2666MHZ", "3200MHZ", "3600MHZ", "4000MHZ+"] },
      { key: "latency", value: "ĐỘ TRỄ CAS", options: ["CL14", "CL16", "CL18", "CL20"] },
      { key: "voltage", value: "ĐIỆN ÁP", options: ["1.2V", "1.35V", "1.5V"] },
      { key: "type", value: "LOẠI RAM", options: ["DDR3", "DDR4", "DDR5", "LPDDR5"] }
    ],
    SPEAKER: [
      { key: "warranty", value: "BẢO HÀNH", options: ["6 THÁNG", "12 THÁNG", "24 THÁNG"] },
      { key: "type", value: "LOẠI", options: ["2.0", "2.1", "5.1", "7.1", "SOUNDBAR"] },
      { key: "connection", value: "KẾT NỐI", options: ["BLUETOOTH", "AUX", "USB", "HDMI", "OPTICAL"] },
      { key: "power", value: "CÔNG SUẤT", options: ["5W", "10W", "20W", "50W", "100W+"] }
    ],
    CASE: [
      { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "24 THÁNG"] },
      { key: "form_factor", value: "KÍCH THƯỚC", options: ["MINI ITX", "MICRO ATX", "MID TOWER", "FULL TOWER"] },
      { key: "material", value: "CHẤT LIỆU", options: ["THÉP", "NHÔM", "KÍNH CƯỜNG LỰC"] },
      { key: "fan_support", value: "HỖ TRỢ QUẠT", options: ["120MM", "140MM", "200MM"] }
    ],
    CPU: [
      { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "36 THÁNG"] },
      { key: "brand", value: "HÃNG", options: ["INTEL", "AMD"] },
      { key: "core_count", value: "SỐ NHÂN", options: ["2", "4", "6", "8", "12", "16", "32+"] },
      { key: "thread_count", value: "SỐ LUỒNG", options: ["4", "8", "12", "16", "24", "32", "64+"] },
      { key: "base_clock", value: "XUNG NHỊP CƠ BẢN", options: ["2.5GHZ", "3.0GHZ", "3.5GHZ", "4.0GHZ+"] },
      { key: "boost_clock", value: "XUNG NHỊP BOOST", options: ["3.5GHZ", "4.0GHZ", "4.5GHZ", "5.0GHZ+"] }
    ],
    MICRO: [
      { key: "warranty", value: "BẢO HÀNH", options: ["6 THÁNG", "12 THÁNG", "24 THÁNG"] },
      { key: "type", value: "LOẠI", options: ["MIC CÀI ÁO", "MIC ĐỂ BÀN", "MIC THU ÂM", "MIC KHÔNG DÂY"] },
      { key: "connection", value: "KẾT NỐI", options: ["USB", "JACK 3.5MM", "XLR", "BLUETOOTH"] },
      { key: "directionality", value: "HƯỚNG THU", options: ["OMNIDIRECTIONAL", "CARDIOID", "BIDIRECTIONAL", "SHOTGUN"] }
    ],
    LAPTOP: [
      { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "24 THÁNG"] },
      { key: "brand", value: "HÃNG", options: ["DELL", "HP", "ASUS", "LENOVO", "MSI", "APPLE"] },
      { key: "screen_size", value: "KÍCH THƯỚC MÀN HÌNH", options: ["13.3\"", "14\"", "15.6\"", "16\"", "17.3\""] },
      { key: "cpu", value: "CPU", options: ["INTEL CORE I3", "INTEL CORE I5", "INTEL CORE I7", "INTEL CORE I9", "AMD RYZEN 5", "AMD RYZEN 7", "AMD RYZEN 9"] },
      { key: "ram", value: "RAM", options: ["4GB", "8GB", "16GB", "32GB", "64GB"] },
      { key: "storage", value: "Ổ CỨNG", options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB HDD"] }
    ],
    VGA: [
      { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "36 THÁNG"] },
      { key: "brand", value: "HÃNG", options: ["NVIDIA", "AMD"] },
      { key: "model", value: "DÒNG CHIP", options: ["GTX 1650", "RTX 3060", "RTX 4070", "RX 6600", "RX 7900 XTX"] },
      { key: "vram", value: "DUNG LƯỢNG VRAM", options: ["4GB", "6GB", "8GB", "12GB", "16GB"] },
      { key: "power_requirement", value: "CÔNG SUẤT YÊU CẦU", options: ["300W", "450W", "650W", "850W+"] }
    ],
    SCREEN: [
      { key: "warranty", value: "BẢO HÀNH", options: ["12 THÁNG", "24 THÁNG"] },
      { key: "size", value: "KÍCH THƯỚC", options: ["21.5\"", "24\"", "27\"", "32\"", "34\"", "49\""] },
      { key: "resolution", value: "ĐỘ PHÂN GIẢI", options: ["1080P", "1440P", "4K", "8K"] },
      { key: "refresh_rate", value: "TẦN SỐ QUÉT", options: ["60HZ", "75HZ", "120HZ", "144HZ", "165HZ", "240HZ"] },
      { key: "panel_type", value: "LOẠI TẤM NỀN", options: ["IPS", "VA", "TN", "OLED"] }
    ]
  };


  const colors = [
    { key: "black", value: "Đen" },
    { key: "white", value: "Trắng" },
    { key: "red", value: "Đỏ" },
    { key: "blue", value: "Xanh" },
    { key: "green", value: "Xanh lá" },
    { key: "yellow", value: "Vàng" },
    { key: "purple", value: "Tím" },
    { key: "gray", value: "Xám" },
    { key: "brown", value: "Nâu" },
    { key: "pink", value: "Hồng" },
    { key: "orange", value: "Cam" }
  ];

  const brands = [
    { key: 'intel', value: 'Intel' },
    { key: 'corsair', value: 'Corsair' },
    { key: 'dell', value: 'Dell' },
    { key: 'razer', value: 'Razer' },
    { key: 'nvidia', value: 'NVIDIA' },
    { key: 'samsung', value: 'Samsung' },
    { key: 'logitech', value: 'Logitech' },
    { key: 'lg', value: 'LG' },
    { key: 'asus', value: 'ASUS' },
    { key: 'nzxt', value: 'NZXT' },
    { key: 'aula', value: 'AULA' },
  ]

  useEffect(() => {
    fetchCategories();
    fetchUpdateProduct();
    fetchSpecificationsByProductId();
  }, [updateProductId]);

  const fetchCategories = async () => {
    try {
      const response = await findAllCategory();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const fetchUpdateProduct = async () => {
    if (!updateProductId) {
      setIsAllowUpdate(false);
      return
    };
    try {
      const response = await findProductById(updateProductId);
      setName(response.data.name);
      setDescription(response.data.description);
      let displayPrice = String(response.data.price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      setPrice(displayPrice);
      setBrand(response.data.brand);
      setBrandSelected(response.data.brand);
      setSelectedColor(response.data.color);
      setColor(response.data.color);
      setSize(response.data.size);
      setWeight(response.data.weight);
      setGuaranteePeriod(response.data.guaranteePeriod);
      setSelectedCategory({ id: response.data.category.id, name: response.data.category.name });
      const images = response.data.image.includes(",")
        ? response.data.image.split(",")
        : [response.data.image];
      console.log(images)
      setImages(images);
      setIsAllowUpdate(true);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };
  const fetchSpecificationsByProductId = async () => {
    try {
      if (updateProductId) {
        const response = await findSpecificationsByProductId(updateProductId);
        console.log("Thông số kỹ thuật của sản phẩm update:", response.data);

        setSpecifications(response.data);

        // Cập nhật productData để đổ vào select
        const updatedProductData = response.data.reduce((acc, spec) => {
          acc[spec.name] = spec.value;
          return acc;
        }, {});

        setProductData((prev) => ({ ...prev, ...updatedProductData }));
      }
    } catch (error) {
      console.error("Lỗi khi tải thông số kỹ thuật:", error);
    }
  };
  const onDrop = useCallback(acceptedFiles => {
    if (updateProductId) {
      setImagesUpdate(prev => [...prev, ...acceptedFiles]);
    } else {
      setImages(prev => [...prev, ...acceptedFiles]);
    }
  }, [updateProductId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5242880
  });

  const uploadImages = async (imageArray) => {
    if (!imageArray || imageArray.length === 0) return "";

    console.log("Uploading images:", imageArray);

    const uploadedImages = await Promise.all(
      imageArray.map(async (image) => {
        if (typeof image === "object") {
          const data = new FormData();
          data.append("file", image);
          data.append("upload_preset", "chptt_gear");
          data.append("cloud_name", "chaamz03");

          try {
            const response = await uploadImagesToCloudinary(data);
            if (!response.ok) throw new Error("Upload thất bại");
            const res = await response.json();
            if (!res.url) throw new Error("Không lấy được URL ảnh");
            console.log("Uploaded URL:", res.url);
            return res.url;
          } catch (error) {
            console.error("Upload failed:", error.message);
            return null;
          }
        }
        return image;
      })
    );

    const validImages = uploadedImages.filter((url) => url !== null);
    const imagesString = validImages.join(",");

    console.log("Final Images String:", imagesString);

    return imagesString;
  };


  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  /** Kiểm tra giá trị nhập product */
  const validateProduct = () => {
    if (!name.trim()) {
      alert("Tên sản phẩm không được để trống");
      return false;
    };
    if (!brandSelected && !updateProductId) {
      alert("Nhà sản xuất không được để trống");
      return false;
    };
    if (!color) {
      alert("Màu sắc không được để trống");
      return false;
    };
    if (!size) {
      alert("Kích thước không được để trống");
      return false;
    }
    // else {
    //   if (!size.match(/^[1-9]\d*(\.\d+)?x[1-9]\d*(\.\d+)?x[1-9]\d*(\.\d+)?$/)) {
    //     alert("Kích thước nhập số dương theo định dạng D x R x C");
    //     return false;
    //   }
    // };
    if (!weight) {
      alert("Trọng lượng không được để trống");
      return false;
    } else {
      if (!isFinite(weight) || Number(weight) <= 0) {
        alert("Trọng lượng  nhập số nguyên dương");
        return false;
      }
    };
    if (!guaranteePeriod) {
      alert("Thời gian bảo hành không được để trống");
      return false;
    } else {
      if (!isFinite(guaranteePeriod)) {
        alert("Thời gian bảo hành nhập số");
        return false;
      }
      if (guaranteePeriod <= 0) {
        alert("Thời gian bảo hành phải lớn hơn 1");
        return false;
      }
    }
    if (!selectedCategory.id) {
      alert("Loại sản phẩm không được để trống");
      return false;
    }
    return true;
  };
  const validateSpecification = (specs) => {
    console.log(specs, "valid leng");
    if (specs.length === 0) return false;
    return specs.some(spec => spec.value.trim() !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit form");

    if (!validateProduct()) return;

    try {
      const imgString = updateProductId
        ? await uploadImages(imagesUpdate)
        : await uploadImages(images);

      if (!imgString && !updateProductId) {
        toast.error("Phải tải lên ít nhất 1 ảnh sản phẩm");
        return;
      }

      if (updateProductId) {
        await handlerUpdateProduct(imgString);
      } else {
        await handlerCreateProduct(imgString);
      }

      handleReset();
    } catch (error) {
      console.error("Lỗi khi submit sản phẩm:", error.message);
    }
  };

  const handlerCreateProduct = async (imgString) => {
    try {
      const category = categories.find((category) => category.id === selectedCategory.id);
      const updatedSpecifications = specsFields
        .map((spec) => ({
          name: spec.key,
          name_vi: spec.value,
          value: productData[spec.key] || "",
        }))
        .filter((spec) => spec.value.trim() !== "");

      console.log("Thông số kỹ thuật hợp lệ:", updatedSpecifications);

      const newProduct = {
        name,
        description,
        price: parseFloat(price.replace(/,/g, '')),
        brand: brandSelected,
        image: imgString,
        color,
        size,
        weight,
        guaranteePeriod,
        category,
        modifiedDate: new Date().toISOString(),
        specifications: updatedSpecifications,
      };

      const responseProduct = await createProduct(newProduct);
      console.log(responseProduct.status);

      if (updatedSpecifications.length > 0 && responseProduct.status === 201) {
        updatedSpecifications.forEach(async (spec) => {
          const responseSpecification = await createSpecification({
            product: responseProduct.data,
            name: spec.name,
            name_vi: spec.name_vi,
            value: spec.value,
          });

          if (responseSpecification.status === 201) {
            console.log("Thêm thông số kỹ thuật thành công");
          }
        });
      }

      toast.success("Thêm sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.response?.data || error.message);
    }
  };


  const handlerUpdateProduct = async (imgString) => {
    try {
      const category = categories.find((category) => category.id === selectedCategory?.id);

      // Đảm bảo xử lý hình ảnh đúng định dạng
      const updatedImage = imgString
        ? [...(Array.isArray(images) ? images : images?.split(",") || []), imgString]
        : images;

      console.log("Hình ảnh cập nhật:", updatedImage);

      // Cập nhật specifications
      const updatedSpecifications = specsFields.map((spec) => {
        const existingSpec = specifications.find((s) => s.name === spec.key);
        return {
          id: existingSpec?.id || null,
          name: spec.key,
          name_vi: spec.value,
          value: productData[spec.key] || "",
        };
      }).filter((spec) => spec.value.trim() !== "");

      const updatedProduct = {
        name,
        description,
        price: parseFloat(price.replace(/,/g, "")),
        brand: brandSelected,
        image: updatedImage.join(","),  // Chuyển mảng thành chuỗi trước khi gửi
        color,
        size,
        weight,
        guaranteePeriod,
        category,
        modifiedDate: new Date().toISOString(),
      };

      const responseProduct = await updateProduct(updateProductId, updatedProduct);

      if (responseProduct.status === 200 && updatedSpecifications.length > 0) {
        for (const spec of updatedSpecifications) {
          try {
            if (spec.id) {
              const responseSpecification = await updateSpecification(spec.id, {
                product: responseProduct.data,
                name: spec.name,
                name_vi: spec.name_vi,
                value: spec.value,
              });

              if (responseSpecification.status === 200) {
                console.log(`Cập nhật thông số kỹ thuật thành công: ${spec.name}`);
              }
            } else {
              const responseSpecification = await createSpecification({
                product: responseProduct.data,
                name: spec.name,
                name_vi: spec.name_vi,
                value: spec.value,
              });

              if (responseSpecification.status === 201) {
                console.log(`Tạo mới thông số kỹ thuật thành công: ${spec.name}`);
              }
            }
          } catch (error) {
            console.error(`Lỗi khi xử lý thông số kỹ thuật (${spec.name}):`, error.response?.data || error.message);
          }
        }
      }

      toast.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data || error.message);
    }
  };


  const handleReset = () => {
    setName("");
    setDescription("");
    setPrice("");
    setBrand({ key: "", value: "" });
    setImages([])
    setColor("#000000");
    setSize("");
    setWeight("");
    setGuaranteePeriod("");
    setBrandSelected({ key: "", value: "" });
    setSelectedCategory({ id: "", name: "" });
    setSpecifications([{ name: "", name_vi: "", value: "" }]);
    console.log("Reset");
    setUpdateProductId("");
    setInventorys([]);
    setCategories([]);
    setShowProductModal({ show: false, productId: "" });
    setIsAllowUpdate(false);
  };

  const handleCategoryChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    const selectedId = e.target.value;
    const selectedName = e.target.options[selectedIndex].text;

    setSelectedCategory({ id: selectedId, name: selectedName });
    setSelectedSpec("");
    console.log("Loại sản phẩm:", selectedName);
  };

  const handleBrandChange = (e) => {
    setBrandSelected(e.target.value);
    setBrand(e.target.value);
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    setColor(e.target.value);
    console.log("Màu sắc:", e.target.value);
  };

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value) {
      // Thêm dấu phẩy vào sau mỗi 3 chữ số
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    setPrice(value);
  };
  const handleSpecChange = (key, value) => {
    setProductData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-30">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50">
          <div className="flex justify-center items-center w-full h-140 mt-20">
            <ClockLoader
              className="flex justify-center items-center w-full mt-20"
              color="#5EEAD4"
              cssOverride={{
                display: 'block',
                margin: '0 auto',
                borderColor: 'blue'
              }}
              loading
              speedMultiplier={3}
              size={40}
            />
          </div>
        </div>
      )}
      <div className="min-h-[80vh] max-h-[80vh] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 w-10/12 ">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold leading-6 text-gray-900">Thông tin sản phẩm</h3>
          <button
            type="button"
            onClick={() => setShowProductModal({ show: false, productId: "" })}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="w-full mx-auto max-h-[65vh] overflow-y-auto">
          <div className="space-y-8 divide-y divide-gray-200 w-full">
            <div className="space-y-6">
              <div className="w-full ">

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                  <input
                    id="productName"
                    disabled={isAllowUpdate}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full p-3 border   rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                    Nhà sản xuất
                  </label>
                  <select
                    id="productBrand"
                    disabled={isAllowUpdate}
                    name="productBrand"
                    value={brandSelected}
                    onChange={handleBrandChange}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Chọn thương hiệu sản xuất"
                  >
                    <option value="" disabled>Chọn thương hiệu sản xuất</option>
                    {brands.map((brand) => (
                      <option key={brand.value} value={brand.key}>
                        {brand.value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Màu sắc</label>
                  <select
                    id="productColor"
                    name="productColor"
                    value={selectedColor}
                    onChange={handleColorChange}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Select a product type"
                  >
                    <option value="" disabled>Chọn màu</option>
                    {colors.map((color) => (
                      <option key={color.key} value={color.key}>
                        {color.value}
                      </option>
                    ))}
                  </select>

                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Kích thước (D x R X C)</label>

                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />


                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Trọng lượng (gram)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />

                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Thời gian bảo hành (tháng)</label>
                  <input
                    type="number"
                    value={guaranteePeriod}
                    onChange={(e) => setGuaranteePeriod(e.target.value)}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Giá bán</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">VND</span>
                    </div>
                    <input
                      id="productPrice"
                      disabled={isAllowUpdate}
                      type="text"
                      value={price}
                      onChange={(e) => handlePriceChange(e)}
                      className="mt-1 block w-full pl-16 p-3 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 p-3 block w-full shadow-sm border border-gray-300   rounded-md  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                    Loại sản phẩm
                  </label>
                  <select
                    id="productType"
                    disabled={isAllowUpdate}
                    name="productType"
                    value={selectedCategory.id}
                    onChange={handleCategoryChange}
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    aria-label="Select a product type"
                  >
                    <option value="" disabled>Chọn loại sản phẩm</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name_Vi}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                  {/* Upload area */}
                  <div
                    {...getRootProps()}
                    className="mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <FiUpload className="h-12 w-12 text-gray-400" />
                    <input {...getInputProps()} className="hidden" />
                    <p className="mt-2 text-sm text-gray-600">
                      {isDragActive
                        ? "Thả file vào đây..."
                        : "Kéo và thả hình ảnh hoặc nhấn để chọn"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG tối đa 5MB</p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {images.filter(Boolean).map((file, index) => {
                      let imageUrl = typeof file === "object" ? URL.createObjectURL(file) : file;
                      return (
                        <div key={`new-${index}`} className="relative overflow-hidden rounded-lg shadow-md group">
                          <img
                            src={imageUrl}
                            alt={`Preview ${index + 1}`}
                            className="h-32 w-full object-cover transform transition duration-300 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, false)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}

                    {imagesUpdate.filter(Boolean).map((file, index) => {
                      let imageUrl1 = typeof file === "object" ? URL.createObjectURL(file) : file;
                      return (
                        <div key={`update-${index}`} className="relative overflow-hidden rounded-lg shadow-md group">
                          <img
                            src={imageUrl1}
                            alt={`Preview ${index + 1}`}
                            className="h-32 w-full object-cover transform transition duration-300 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, false)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}

                  </div>
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">Thông số kỹ thuật</h4>
                  </div>
                  <div className="mt-4 space-y-4">
                    {specsFields.length > 0 &&
                      specsFields.map((spec) => (
                        <div key={spec.key} className="flex items-center justify-between">
                          <label htmlFor={spec.key} className="w-1/3 text-sm font-medium text-gray-700">
                            {spec.value}
                          </label>
                          <select
                            id={spec.key}
                            name={spec.key}
                            value={productData[spec.key] || ""}  // Hiển thị giá trị đã load
                            onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                            className="w-2/3 p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="" disabled>
                              Chọn {spec.value}
                            </option>
                            {spec.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end gap-3 mb-8">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleReset}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
