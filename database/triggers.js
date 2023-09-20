const sequelize = require(".");

async function triggers() {
  try {
    await sequelize.query(
      `
      CREATE OR REPLACE FUNCTION update_saldo()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE deudas
        SET saldo = NEW.monto
        WHERE "idDeuda" = NEW."idDeuda"; 
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;


      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.triggers 
          WHERE event_object_table = 'deudas'
            AND trigger_name = 'set_saldo_inicial'
        ) THEN
          
          CREATE TRIGGER set_saldo_inicial
            AFTER INSERT ON deudas
            FOR EACH ROW
            EXECUTE FUNCTION update_saldo();
        
        END IF;
        
      END $$;     
`
    );

    await sequelize.query(
      `
    CREATE OR REPLACE FUNCTION update_estado()
    RETURNS TRIGGER AS $$
    DECLARE 
        saldo_anterior DECIMAL(10, 2);
    BEGIN
      -- Obtener el saldo de la tabla deuda
      SELECT saldo INTO saldo_anterior
      FROM deudas
      WHERE "idDeuda" = NEW."deudaId"; 
      
      -- Actualizar el estado de pagado
      IF NEW.monto = saldo_anterior THEN
          UPDATE deudas
          SET pagada = true, saldo = 0
          WHERE "idDeuda" = NEW."deudaId"; 
      ELSE
          UPDATE deudas
          SET saldo = saldo_anterior - NEW.monto 
          WHERE "idDeuda" = NEW."deudaId"; 
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
   
    DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.triggers 
          WHERE event_object_table = 'pagos'
            AND trigger_name = 'actualizar_estado_saldo'
        ) THEN
          
        CREATE TRIGGER actualizar_estado_saldo
        AFTER INSERT ON pagos 
        FOR EACH ROW
        EXECUTE FUNCTION update_estado();
        
        END IF;
      END $$;   
    
`
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = triggers;
