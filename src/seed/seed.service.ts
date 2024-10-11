import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { release } from 'os';
import { Department } from '../address/entities/department.entity';
import { City } from '../address/entities/city.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/roles.enum';
import * as bcrypt from 'bcrypt';
import { Address } from '../address/entities/address.entity';
import { PaymentMethod } from '../orders/entities/payment_method';
import { Order } from '../orders/entities/order.entity';
import { Status } from '../orders/entities/status.enum';
import { ProductCategory } from '../products/entities/product-category.entity';
import { Product } from '../products/entities/products.entity';
import { OrderDetail } from '../orders/entities/order_detail.entity';
import { Comment } from '../resources/entities/comment.entity';
import { Review } from '../resources/entities/review.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly dataSource: DataSource
  ){}

  async seed () {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const departmentRepository = queryRunner.manager.getRepository(Department);
      const cityRepository = queryRunner.manager.getRepository(City);
      const userRepository = queryRunner.manager.getRepository(User);
      const addressRepository = queryRunner.manager.getRepository(Address);
      const paymentMethodRepository = queryRunner.manager.getRepository(PaymentMethod);
      const orderRepository = queryRunner.manager.getRepository(Order);
      const productCategoryRepository = queryRunner.manager.getRepository(ProductCategory);
      const productRepository = queryRunner.manager.getRepository(Product);
      const orderDetailRepository = queryRunner.manager.getRepository(OrderDetail);
      const commentRepository = queryRunner.manager.getRepository(Comment);
      const reviewRepository = queryRunner.manager.getRepository(Review);

      const cities = await cityRepository.find();
      await cityRepository.remove(cities);
      const departments = await departmentRepository.find();
      await departmentRepository.remove(departments)
      const users = await userRepository.find()
      await userRepository.remove(users)
      const address = await addressRepository.find()
      await addressRepository.remove(address)
      const paymentMethod = await paymentMethodRepository.find()
      await paymentMethodRepository.remove(paymentMethod)
      const order = await orderRepository.find()
      await orderRepository.remove(order)
      const productCategory = await productCategoryRepository.find()
      await productCategoryRepository.remove(productCategory);
      const product = await productRepository.find()
      await productRepository.remove(product)
      const orderDetail = await orderDetailRepository.find()
      await orderDetailRepository.remove(orderDetail)
      const comment = await commentRepository.find()
      await commentRepository.remove(comment)
      const review = await reviewRepository.find();
      await reviewRepository.remove(review)

      const deparm1 = departmentRepository.create({ name: "Amazonas" });
      const deparm2 = departmentRepository.create({ name: "Antioquia" });
      const deparm3 = departmentRepository.create({ name: "Arauca" });
      const deparm4 = departmentRepository.create({ name: "Atlántico" });
      const deparm5 = departmentRepository.create({ name: "Bolívar" });
      const deparm6 = departmentRepository.create({ name: "Boyacá" });
      const deparm7 = departmentRepository.create({ name: "Caldas" });
      const deparm8 = departmentRepository.create({ name: "Caquetá" });
      const deparm9 = departmentRepository.create({ name: "Casanare" });
      const deparm10 = departmentRepository.create({ name: "Cauca" });
      const deparm11 = departmentRepository.create({ name: "Cesar" });
      const deparm12 = departmentRepository.create({ name: "Chocó" });
      const deparm13 = departmentRepository.create({ name: "Córdoba" });
      const deparm14 = departmentRepository.create({ name: "Cundinamarca" });
      const deparm15 = departmentRepository.create({ name: "Guainía" });
      const deparm16 = departmentRepository.create({ name: "Guaviare" });
      const deparm17 = departmentRepository.create({ name: "Huila" });
      const deparm18 = departmentRepository.create({ name: "La Guajira" });
      const deparm19 = departmentRepository.create({ name: "Magdalena" });
      const deparm20 = departmentRepository.create({ name: "Meta" });
      const deparm21 = departmentRepository.create({ name: "Nariño" });
      const deparm22 = departmentRepository.create({ name: "Norte de Santander" });
      const deparm23 = departmentRepository.create({ name: "Putumayo" });
      const deparm24 = departmentRepository.create({ name: "Quindío" });
      const deparm25 = departmentRepository.create({ name: "Risaralda" });
      const deparm26 = departmentRepository.create({ name: "San Andrés y Providencia" });
      const deparm27 = departmentRepository.create({ name: "Santander" });
      const deparm28 = departmentRepository.create({ name: "Sucre" });
      const deparm29 = departmentRepository.create({ name: "Tolima" });
      const deparm30 = departmentRepository.create({ name: "Valle del Cauca" });
      const deparm31 = departmentRepository.create({ name: "Vaupés" });
      const deparm32 = departmentRepository.create({ name: "Vichada" });

      await departmentRepository.save([
        deparm1, deparm2, deparm3, deparm4, deparm5, deparm6, deparm7, deparm8, 
        deparm9, deparm10, deparm11, deparm12, deparm13, deparm14, deparm15, 
        deparm16, deparm17, deparm18, deparm19, deparm20, deparm21, deparm22, 
        deparm23, deparm24, deparm25, deparm26, deparm27, deparm28, deparm29, 
        deparm30, deparm31, deparm32
      ]);
      
      const city1 = cityRepository.create({ name: "Bogotá", department: deparm14 });
      const city2 = cityRepository.create({ name: "Medellín", department: deparm2 });
      const city3 = cityRepository.create({ name: "Cali", department: deparm30 });
      const city4 = cityRepository.create({ name: "Barranquilla", department: deparm8 });
      const city5 = cityRepository.create({ name: "Cartagena", department: deparm13 });
      const city6 = cityRepository.create({ name: "Cúcuta", department: deparm22 });
      const city7 = cityRepository.create({ name: "Bucaramanga", department: deparm20 });
      const city8 = cityRepository.create({ name: "Pereira", department: deparm25 });
      const city9 = cityRepository.create({ name: "Santa Marta", department: deparm19 });
      const city10 = cityRepository.create({ name: "Ibagué", department: deparm26 });
      const city11 = cityRepository.create({ name: "Villavicencio", department: deparm6 });
      const city12 = cityRepository.create({ name: "Pasto", department: deparm23 });


      await cityRepository.save([
        city1, city2, city3, city4, city5, city6, city7, city8, 
        city9, city10, city11, city12
      ]);

      
      const user1 = userRepository.create({
        name: 'John Doe',
        password: 'password123',
        email: 'john.doe@example.com',
        role: Role.USER,
        photo_url: 'https://example.com/photo1.jpg'
      });
      
      user1.password = bcrypt.hashSync(user1.password, 10)
      await userRepository.save(user1);
    
      const user2 = userRepository.create({
        name: 'Jane Smith',
        password: 'password123',
        email: 'jane.smith@example.com',
        role: Role.USER,
        photo_url: 'https://example.com/photo2.jpg'
      });
      user2.password = bcrypt.hashSync(user2.password, 10)
      await userRepository.save(user2);


      const address1 = addressRepository.create({
        street: '123 Main St',
        avenue: '1st Avenue',
        house_number: '10',
        user: user1,
        city: city1
      });
    
      const address2 = addressRepository.create({
        street: '456 Elm St',
        avenue: '2nd Avenue',
        house_number: '20',
        user: user2,
        city: city2
      });
    
      // Guardar direcciones
      await addressRepository.save([address1, address2]);
      
         // Crear métodos de pago
      const paymentMethod1 = paymentMethodRepository.create({
        payment_name: 'Credit'
      });

      const paymentMethod2 = paymentMethodRepository.create({
        payment_name: 'Debit'
      });

      // Guardar métodos de pago
      await paymentMethodRepository.save(paymentMethod1);
      await paymentMethodRepository.save(paymentMethod2);

        // Crear órdenes
  const order1 = orderRepository.create({
    status: Status.RECEIVED,
    date: new Date('2023-01-01'),
    customer: user1,
    payment_method: paymentMethod1,
    address: address1
  });

  const order2 = orderRepository.create({
    status: Status.PENDING,
    date: new Date('2023-01-02'),
    customer: user2,
    payment_method: paymentMethod2,
    address: address2
  });

  // Guardar órdenes
  await orderRepository.save(order1);
  await orderRepository.save(order2);

    // Crear categorías de productos
    const category1 = productCategoryRepository.create({
      category: 'Computador'
    });
  
    const category2 = productCategoryRepository.create({
      category: 'Portatil'
    });
  
    const category3 = productCategoryRepository.create({
      category: 'Celular'
    });
  
    const category4 = productCategoryRepository.create({
      category: 'Apple'
    });
  
    // Guardar categorías de productos
    await productCategoryRepository.save(category1);
    await productCategoryRepository.save(category2);
    await productCategoryRepository.save(category3);
    await productCategoryRepository.save(category4);

    const product1 = productRepository.create({
      product_name: 'Producto 1',
      description: 'Descripción del producto 1',
      price: 100,
      photo_url: ['https://ejemplo.com/imagen1.jpg'],
      quantity: 10,
      product_category: category1, // Asigna la categoría correspondiente
      seller: user2 // Asigna un usuario como vendedor
    });

    const product2 = productRepository.create({
      product_name: 'Producto 2',
      description: 'Descripción del producto 2',
      price: 200,
      photo_url: ['https://ejemplo.com/imagen2.jpg'],
      quantity: 5,
      product_category: category2, // Asigna la categoría correspondiente
      seller: user1 // Asigna otro usuario como vendedor
    });

    // Guardar productos
    await productRepository.save([product1, product2]);

    const orderDetail1 = orderDetailRepository.create({
      quantity: 2, // Ejemplo de cantidad
      order: order1, // Asigna una orden existente
      product: product1 // Asigna un producto existente
    });

    const orderDetail2 = orderDetailRepository.create({
      quantity: 1, // Ejemplo de cantidad
      order: order2, // Asigna otra orden existente
      product: product2 // Asigna otro producto existente
    });

    // Guardar detalles de orden
    await orderDetailRepository.save([orderDetail1, orderDetail2]);

    const comment1 = commentRepository.create({
      description: 'Este es un comentario de ejemplo 1', // Ejemplo de descripción
      customer: user2, // Asigna un usuario como autor del comentario
      product: product2 // Asigna un producto al que pertenece el comentario
    });

    const comment2 = commentRepository.create({
      description: 'Este es un comentario de ejemplo 2', // Ejemplo de descripción
      customer: user2, // Asigna otro usuario como autor del comentario
      product: product1 // Asigna otro producto al que pertenece el comentario
    });

    // Guardar comentarios
    await commentRepository.save([comment1, comment2]);


    const review1 = reviewRepository.create({
      score: 4.5, // Ejemplo de puntuación
      comment: 'Excelente producto', // Ejemplo de comentario
      customer: user2, // Asigna un usuario como autor de la review
      product: product1 // Asigna un producto al que se refiere la review
    });

    const review2 = reviewRepository.create({
      score: 3.8, // Ejemplo de puntuación
      comment: 'Buen producto, pero podría mejorar', // Ejemplo de comentario
      customer: user1, // Asigna otro usuario como autor de la review
      product: product2 // Asigna otro producto al que se refiere la review
    });

    await reviewRepository.save([review1, review2]);

      await queryRunner.commitTransaction();
    }catch(error){
      await queryRunner.rollbackTransaction()
      throw error
    }finally{
      await queryRunner.release()
      return ("seeder was success")
    }

  }
}
